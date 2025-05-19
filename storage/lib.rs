use candid::{CandidType, Deserialize};
use ic_cdk::{init, query, update};
use std::collections::HashMap;
use std::sync::Mutex;
use ic_cdk::api::caller;
use ic_cdk::api::call::call;
use lazy_static::lazy_static;
use candid::Principal;
use std::time::{SystemTime, UNIX_EPOCH};

type PrincipalId = String;


#[derive(CandidType, Deserialize, Clone)]
struct RecycleData {
    image: Vec<u8>,
    comment: String,
    location: String,
    principal_id: PrincipalId,
    created_at: u128 ,
}

#[derive(CandidType, Deserialize, Clone)]
struct Brand {
    principal_id: PrincipalId,
    id: String,
    image: String,
    comment: String,
    location: String,
    created_at: u128,
    employees_ids: Vec<String>,
}

#[derive(CandidType, Deserialize, Clone)]
struct User {
    principal_id: PrincipalId,
    name: String,
    description: String,
    image: String,
    location: String,
    created_at: u128,
}

impl RecycleData {
    pub fn new(location: String, comment: String, image: Vec<u8>, principal_id: String, created_at: u128) -> Self {
        RecycleData {
            image,
            comment,
            location,
            principal_id,
            created_at,
        }
    }
}

#[derive(Clone, CandidType, Deserialize)]
struct RecycleDataWithoutImage {
    comment: String,
    location: String,
    principal_id: String,
}

lazy_static! {
    static ref STORAGE: Mutex<HashMap<String, Vec<RecycleData>>> = Mutex::new(HashMap::new());
}

static mut USERS: Option<HashMap<PrincipalId, User>> = None;
static mut BRANDS: Option<HashMap<String, Brand>> = None; 
const DIP20_CANISTER_ID: &str = "bw4dl-smaaa-aaaaa-qaacq-cai";

#[init]
fn init() {
    unsafe {
        USERS = Some(HashMap::new());
        BRANDS = Some(HashMap::new());
    }
}

fn get_epoch_ms() -> u128 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis()
}

#[update]
fn create_or_get_user(principal_id: PrincipalId) -> User {
    unsafe {
        let users = USERS.as_mut().unwrap();
        users.entry(principal_id.clone()).or_insert(User {
            principal_id,
            name: "".to_string(),
            description: "".to_string(),
            image: "".to_string(),
            location: "".to_string(),
            created_at: get_epoch_ms(),

        }).clone()
    }
}

#[query]
fn get_user(principal_id: PrincipalId) -> Option<User> {
    unsafe {
        USERS.as_ref().unwrap().get(&principal_id).cloned()
    }
}

#[query]
fn user_works_for_brand(user_id: PrincipalId, brand_id: String) -> bool {
    unsafe {
        BRANDS.as_ref().unwrap().get(&brand_id)
            .map(|b| b.employees_ids.contains(&user_id))
            .unwrap_or(false)
    }
}

#[update]
fn create_brand(brand: Brand) -> Result<(), String> {
    unsafe {
        let brands = BRANDS.as_mut().unwrap();
        if brands.contains_key(&brand.id) {
            return Err("Brand with this ID already exists.".to_string());
        }
        brands.insert(brand.id.clone(), brand);
        Ok(())
    }
}

#[query]
fn get_brands_by_principal(principal_id: PrincipalId) -> Vec<Brand> {
    unsafe {
        BRANDS.as_ref().unwrap()
            .values()
            .filter(|b| b.principal_id == principal_id)
            .cloned()
            .collect()
    }
}

#[query]
fn get_brand_with_employees(brand_id: String) -> Option<(Brand, Vec<User>)> {
    unsafe {
        let brands = BRANDS.as_ref().unwrap();
        let users = USERS.as_ref().unwrap();

        brands.get(&brand_id).map(|brand| {
            let employees: Vec<User> = brand.employees_ids.iter()
                .filter_map(|id| users.get(id))
                .cloned()
                .collect();
            (brand.clone(), employees)
        })
    }
}

#[update]
fn update_user(name: String, description: String, image: String, location: String) -> Result<User, String> {
    let principal_id = ic_cdk::caller().to_string();

    unsafe {
        if let Some(users) = USERS.as_mut() {
            if let Some(user) = users.get_mut(&principal_id) {
                user.name = name;
                user.description = description;
                user.image = image;
                user.location = location;
                return Ok(user.clone());
            } else {
                return Err("User not found".to_string());
            }
        } else {
            return Err("Users storage not initialized".to_string());
        }
    }
}



async fn reward_user(user: Principal) -> Result<String, String> {
    let result: Result<((),), _> = call(
        Principal::from_text(DIP20_CANISTER_ID).unwrap(),
        "mint",
        (user, 1000u64),
    ).await;

    result.map_err(|e| format!("Minting failed: {:?}", e)).map(|r| (format!("Minting res: {:?}", r)))
}

#[update]
async fn store_data(image: Vec<u8>, comment: String, location: String) -> String {
    let principal_id = caller().to_string();
    let recycle_data = RecycleData { image, comment, location, principal_id: principal_id.clone(), created_at: get_epoch_ms() };

    let mut storage = STORAGE.lock().unwrap();
    let user_records = storage.entry(principal_id.clone()).or_insert(vec![]);
    user_records.push(recycle_data);
    //reward_user(caller()).await;
    principal_id
}

#[query]
fn get_recycle_data(principal_id: String) -> Vec<RecycleDataWithoutImage> {
    let storage = STORAGE.lock().unwrap();
    
    let data = storage.get(&principal_id)
        .cloned()
        .unwrap_or_default()
        .into_iter()
        .map(|recycle_data| RecycleDataWithoutImage {
            comment: recycle_data.comment,
            location: recycle_data.location,
            principal_id: recycle_data.principal_id
        })
        .collect();
    
    data
}

#[query]
fn get_all_recycle_data() -> Vec<RecycleDataWithoutImage> {
    let storage = STORAGE.lock().unwrap();
    
    let data = storage.values()
        .flat_map(|entries| entries.iter().cloned())
        .map(|recycle_data| RecycleDataWithoutImage {
            comment: recycle_data.comment,
            location: recycle_data.location,
            principal_id: recycle_data.principal_id
        })
        .collect();

    data
}

ic_cdk::export_candid!();

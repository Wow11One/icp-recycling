use candid::{CandidType, Deserialize};
use ic_cdk::{query, update};
use std::collections::HashMap;
use std::sync::Mutex;
use ic_cdk::api::caller;
use ic_cdk::api::call::call;
use lazy_static::lazy_static;
use candid::Principal;

type PrincipalId = String;


#[derive(CandidType, Deserialize, Clone)]
struct RecycleData {
    image: Vec<u8>,
    comment: String,
    location: String,
    principal_id: PrincipalId,
    created_at: u32,
}

#[derive(CandidType, Deserialize, Clone)]
struct Brand {
    principal_id: PrincipalId,
    id: String,
    image: String,
    comment: String,
    location: String,
    created_at: u32,
    employees_ids: Vec<String>,
}

#[derive(CandidType, Deserialize, Clone)]
struct User {
    principal_id: PrincipalId,
    name: String,
    description: String,
    image: String,
    location: String,
    created_at: u32,
}

impl RecycleData {
    pub fn new(location: String, comment: String, image: Vec<u8>, principal_id: String, created_at: u32) -> Self {
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



async fn reward_user(user: Principal) -> Result<String, String> {
    let result: Result<((),), _> = call(
        Principal::from_text(DIP20_CANISTER_ID).unwrap(),
        "mint",
        (user, 1000u64),
    ).await;

    result.map_err(|e| format!("Minting failed: {:?}", e)).map(|r| (format!("Minting res: {:?}", r)))
}

#[update]
async fn store_data(image: Vec<u8>, comment: String, location: String, created_at: u32) -> String {
    let principal_id = caller().to_string();
    let recycle_data = RecycleData { image, comment, location, principal_id: principal_id.clone() };

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

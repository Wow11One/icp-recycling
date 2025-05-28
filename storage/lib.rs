use candid::{CandidType, Deserialize, Nat};
use ic_cdk::{api::management_canister::http_request::{self, http_request, CanisterHttpRequestArgument, HttpHeader, HttpMethod}, init, query, update};
use serde_json::json;
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
    created_at: u128 ,
}

#[update]
async fn store_data(image: Vec<u8>, comment: String, location: String, created_at: u128) -> Result<String, String> {
    //if !validate_image_with_gemini(image.clone(), &location, &comment).await? {
    //    return Err("AI rejected the image as invalid.".to_string());
    //}
    let principal_id = caller().to_string();
    let recycle_data = RecycleData { image, comment, location, principal_id: principal_id.clone(), created_at };

    let mut storage = STORAGE.lock().unwrap();
    let user_records = storage.entry(principal_id.clone()).or_insert(vec![]);
    user_records.push(recycle_data);
    //reward_user(caller()).await;
    Ok(principal_id)
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
const GEMINI_API_KEY: &str = "bw4dl-smaaa-aaaaa-qaacq-cai";

#[init]
fn init() {
    unsafe {
        USERS = Some(HashMap::new());
        BRANDS = Some(HashMap::new());
    }
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
            created_at: 1747688175838,

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

async fn validate_image_with_gemini(
    image: Vec<u8>,
    location: &str,
    description: &str,
) -> Result<bool, String> {
    let encoded_image = base64::encode(&image);

    let prompt = format!(
        "This image was uploaded with the description: 
        '{}' and the location: '{}'. Is this a valid image of recycling (photo should contain a person from recycling station with trash)? Answer only yes or no.",
        description,
        location
    );

    let payload = json!({
        "contents": [{
            "parts": [
                {
                    "inline_data": {
                        "mime_type": "image/png",
                        "data": encoded_image
                    }
                },
                {
                    "text": prompt
                }
            ]
        }]
    });

    let body = serde_json::to_string(&payload).unwrap();

    let request = CanisterHttpRequestArgument {
        url: format!(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key={}",
            GEMINI_API_KEY
        ),
        method: HttpMethod::POST,
        headers: vec![HttpHeader {
            name: "Content-Type".to_string(),
            value: "application/json".to_string(),
        }],
        body: Some(body.into_bytes()),
        max_response_bytes: Some(3000),
        transform: None,
    };

    let (response,) = http_request(request, 200).await
    .map_err(|e| format!("HTTP request error: {:?}", e))?;

    if response.status != Nat::from(200u32) {
        return Err(format!("Gemini returned status: {}", response.status));
    }

    let response_text = String::from_utf8(response.body)
        .map_err(|_| "Invalid UTF-8 in response".to_string())?;
    let response_json: serde_json::Value = serde_json::from_str(&response_text)
        .map_err(|_| "Invalid JSON in Gemini response".to_string())?;
    let text_response = response_json["candidates"][0]["content"]["parts"][0]["text"]
        .as_str()
        .unwrap_or("")
        .to_lowercase();

    Ok(text_response.contains("yes"))
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

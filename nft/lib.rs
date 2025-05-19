use ic_cdk::storage;
use ic_cdk_macros::{query, update};
use candid::{CandidType, Deserialize};
use std::collections::HashMap;
use std::time::{SystemTime, UNIX_EPOCH};
use ic_cdk_macros::init;

type Owner = String;

#[derive(CandidType, Deserialize, Clone)]
struct NFT {
    id: String,
    title: String,
    description: String,
    token_cost: u64,
    image: String,
    category: String,
    discount_size: u8,
    owner: Owner,
    business_id: String,
    created_at: u32,
}

static mut NFTS: Option<HashMap<u64, NFT>> = None;
static mut NFTS_TEMPLATES: Option<Vec<NFT>> = None;
static mut OWNERSHIP: Option<HashMap<Owner, Vec<u64>>> = None;

#[init]
fn init() {
    unsafe {
        NFTS = Some(HashMap::new());
        OWNERSHIP = Some(HashMap::new());
        NFTS_TEMPLATES = Some(get_template_nfts_helper());  
    }
}

#[update]
fn mint_nft(owner: Owner, nft_id: u64, usage_date: u64) -> Result<(), String> {
    unsafe {
        let nfts = NFTS.as_mut().unwrap();
        let ownership = OWNERSHIP.as_mut().unwrap();

        if let Some(nft) = nfts.get(&nft_id) {
            let user_nfts = ownership.entry(owner.clone()).or_insert(vec![]);
            if user_nfts.contains(&nft_id) {
                return Err("User already owns this NFT".to_string());
            }
            user_nfts.push(nft_id);
            Ok(())
        } else {
            Err("NFT not found".to_string())
        }
    }
}

#[query]
fn get_user_nfts(owner: Owner) -> Vec<NFT> {
    unsafe {
        let ownership = OWNERSHIP.as_ref().unwrap();
        let nfts = NFTS.as_ref().unwrap();
        ownership.get(&owner).map_or(vec![], |ids| {
            ids.iter().filter_map(|id| nfts.get(id)).cloned().collect()
        })
    }
}

#[update]
fn redeem_nft(owner: Owner, nft_id: u64) -> Result<(), String> {
    unsafe {
        let ownership = OWNERSHIP.as_mut().unwrap();
        if let Some(user_nfts) = ownership.get_mut(&owner) {
            if let Some(pos) = user_nfts.iter().position(|&id| id == nft_id) {
                user_nfts.remove(pos);
                return Ok(())
            }
        }
        Err("NFT not owned by user".to_string())
    }
}

#[update]
fn add_nft_template(new_template: NFT) -> Result<(), String> {
    unsafe {
        if let Some(templates) = NFTS_TEMPLATES.as_mut() {
            if templates.iter().any(|nft| nft.id == new_template.id) {
                return Err("Template with this ID already exists".to_string());
            }
            templates.push(new_template);
            Ok(())
        } else {
            Err("NFT templates storage is not initialized".to_string())
        }
    }
}

// #[update]
// fn set_usage_date(owner: Owner, nft_id: u64, usage_date: u64) -> Result<(), String> {
//     unsafe {
//         let ownership = OWNERSHIP.as_mut().unwrap();
//         let nfts = NFTS.as_mut().unwrap();
        
//         if let Some(user_nfts) = ownership.get(&owner) {
//             if user_nfts.contains(&nft_id) {
//                 if let Some(nft) = nfts.get_mut(&nft_id) {
//                     if nft.usage_date.is_none() {
//                         nft.usage_date = Some(usage_date);
//                         return Ok(());
//                     } else {
//                         return Err("Usage date is already set".to_string());
//                     }
//                 }
//             }
//         }
//         Err("NFT not owned by user".to_string())
//     }
// }

#[query]
fn get_template_nfts_helper() -> Vec<NFT> {
    vec![
        NFT {
            id: "eba6837a-28ce-47e8-9b14-9667f8301a03".to_string(),
            title: "3% Off for massage".to_string(),
            description: "Get 3% off for massage from best massagers in Kyiv.".to_string(),
            token_cost: 2500,
            image: "https://jameelaspa.com/blog/wp-content/uploads/2024/10/8897e240-1ecc-4056-b337-265b77c00ff9.jpg".to_string(),
            category: "Experiences".to_string(),
            discount_size: 3,
            owner: "".to_string(),
            business_id: "".to_string(),
            created_at: 1747672763001,
        },
        NFT {
            id: "6b9b4c72-f17f-4dd6-8271-3969278deb28".to_string(),
            title: "3% Off for a visit to ecotoilet".to_string(),
            description: "Get 3% off for a great visit of any ecotoilet in Kyiv.".to_string(),
            token_cost: 2500,
            image: "https://5.imimg.com/data5/SELLER/Default/2023/3/296221674/OS/SI/ZZ/138949979/20211107124356-aab6e690-6963-422f-963e-3cf8e68b87e2-500x500.jpg".to_string(),
            category: "Environmental Impact".to_string(),
            discount_size: 3,
            owner: "".to_string(),
            business_id: "".to_string(),
            created_at: 1747672763001,
        },
        NFT {
            id: "0854978a-6cd4-4bfb-a375-c70c2cd097bb".to_string(),
            title: "5% Off for eco coffee".to_string(),
            description: "5% off, from coffee machine on the Kyiv central bus station.".to_string(),
            token_cost: 5000,
            image: "https://images.prom.ua/6039688327_w600_h600_6039688327.jpg".to_string(),
            category: "Food/drinks".to_string(),
            discount_size: 5,
            owner: "".to_string(),
            business_id: "".to_string(),
            created_at: 1747672763001,
        },
        NFT {
            id: "78eb3b6a-14af-4776-9c28-0e1ac81e7993".to_string(),
            title: "5% Off for eco bag".to_string(),
            description: "5% off for very useful ecobag from 'ATБ' shop.".to_string(),
            token_cost: 5000,
            image: "https://images.prom.ua/4156306023_w640_h640_4156306023.jpg".to_string(),
            category: "Shop".to_string(),
            discount_size: 5,
            owner: "".to_string(),
            business_id: "".to_string(),
            created_at: 1747672763001,
        },
        NFT {
            id: "b2e94850-916e-4d30-be4d-9f69a1204468".to_string(),
            title: "10% Off for eco cosmetics".to_string(),
            description: "10% off for eco cosmetics from 'Eva' shop.".to_string(),
            token_cost: 10000,
            image: "https://www.lanzarotewedding.com/wp-content/uploads/2020/09/cosmeticanatural.jpg".to_string(),
            category: "Shop".to_string(),
            discount_size: 10,
            owner: "".to_string(),
            business_id: "".to_string(),
            created_at: 1747672763001,
        },
        NFT {
            id: "ef19ccd9-f749-4bb3-b352-89889aed57c0".to_string(),
            title: "10% Off for wall clock".to_string(),
            description: "10% off for best eco wall clock from 'Avrora'.".to_string(),
            token_cost: 10000,
            image: "https://likor.pl/wp-content/uploads/2020/11/580_310_fitoal.jpg".to_string(),
            category: "Present".to_string(),
            discount_size: 10,
            owner: "".to_string(),
            business_id: "".to_string(),
            created_at: 1747672763001,
        }
    ]
}

ic_cdk::export_candid!();

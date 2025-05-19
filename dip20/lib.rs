use ic_cdk::{update};
use ic_cdk_macros::{init, query};
use std::collections::HashMap;
use candid::{CandidType, Deserialize};

// Type alias for Account ID
type AccountId = String;

#[derive(CandidType, Deserialize, Clone)]
struct Token {
    name: String,
    symbol: String,
    decimals: u8,
    total_supply: u64,
    balances: HashMap<AccountId, u64>,
    owner: AccountId,
}

static mut TOKEN: Option<Token> = None;

#[init]
fn init(owner: AccountId) {
    let mut balances = HashMap::new();
    balances.insert(owner.clone(), 1_000_000);

    unsafe {
        TOKEN = Some(Token {
            name: "Proof of recycle".to_string(),
            symbol: "POR".to_string(),
            decimals: 8,
            total_supply: 1_000_000,
            balances,
            owner,
        });
    }
}

#[update]
fn transfer(to: AccountId, amount: u64) -> bool {
    unsafe {
        match &TOKEN {
            Some(x) => println!("Result"),
            None    => init(to.clone()),
        }
    }
    let caller = ic_cdk::caller().to_string();
    let token = unsafe { TOKEN.as_mut().unwrap() };

    if let Some(balance) = token.balances.get_mut(&caller) {
        if *balance >= amount {
            *balance -= amount;
            *token.balances.entry(to).or_insert(0) += amount;
            return true;
        }
    }
    false
}

#[update]
fn mint(to: AccountId, amount: u64) -> AccountId {
    unsafe { 
        match &TOKEN {
            Some(x) => println!("Result"),
            None    => init(to.clone()),
        }
    }

    let caller = ic_cdk::caller().to_string();
    let token = unsafe { TOKEN.as_mut().unwrap() };

    token.total_supply += amount;
    *token.balances.entry(to.clone()).or_insert(0) += amount;
    return to;
}

#[update]
fn burn(from: AccountId, amount: u64) -> Result<AccountId, String> {
    let token = unsafe { TOKEN.as_mut().unwrap() };

    let balance = token.balances.get_mut(&from);
    match balance {
        Some(balance) => {
            if *balance >= amount {
                *balance -= amount;
                token.total_supply -= amount;
                Ok(from)
            } else {
                Err("Not enough tokens to burn".to_string())
            }
        },
        None => Err("Account does not have any tokens".to_string()),
    }
}

#[query]
fn balance_of(account: AccountId) -> u64 {
    unsafe { 
        match &TOKEN {
            Some(x) => println!("Result"),
            None    => init(ic_cdk::caller().to_string()),
        }
    }
    let token = unsafe { TOKEN.as_ref().unwrap() };
    *token.balances.get(&account).unwrap_or(&0)
}

#[query]
fn total_supply() -> u64 {
    unsafe { 
        match &TOKEN {
            Some(x) => println!("Result"),
            None    => init(ic_cdk::caller().to_string()),
        }
    }
    let token = unsafe { TOKEN.as_ref().unwrap() };
    token.total_supply
}

ic_cdk::export_candid!();

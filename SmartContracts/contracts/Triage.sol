pragma solidity ^0.4.11;

import "./TriageInterface.sol";


contract Triage is TriageInterface {
    
    // Minimal fee a user has to transmit together with the Fund Claiming Request (in percentage of the funds he wants to reclaim)
    // The user is advised to actually transmit 10%, but in case he'd receive some money in the mean time, we leave some space for the percentage to decrease.
    uint constant minFCReqFeePerc = 9;

    // Maximal fee a user can transmit together with the Fund Claiming Request (in percentage of the funds he wants to reclaim) for the request to still be valid
    uint constant maxFCReqFeePerc = 11;

    // Minimal amount of time that needs to pass for a FC Request to be executed
    uint256 constant fcReqTimeLock = 3 weeks; 

    string public constant name = "Secure Ether";
    string public constant symbol = "SETH";
    uint8 public constant decimals = 18;  // similar to Ether
    uint256 public totalSupply; // variable
    address bank;

    struct Credentials {
        uint256 password; // hash(password + salt)
        uint256 salt;
        
        // index => hash(password + newPubKey + salt)
        mapping(uint256 => uint256) claimFundsRequests;
        uint256 requestsIndex;
    }
    
    // PubKey => Security related data
    mapping(address => Credentials) credentials;
    
    // hash(username) => pubKeys   // used for looking up which PubKey belongs to username, like a DNS
    mapping(uint256 => address) usernames;

    // modifier used for the maintainers of the triage, the bank basically. The ones that created the contract.
    modifier onlyBank {
        require(msg.sender == bank);
        _; // <-- don't delete this, it is needed
    }

    // modifier used for the maintainers of the vault, the bank basically. The ones that created the contract.
    modifier onlyNewUsers(uint256 _hashedUsername, uint256 _hashedPass, uint256 salt) {
        require(credentials[msg.sender].password == 0);
        require(credentials[msg.sender].salt == 0);
        require(usernames[_hashedUsername] == 0);
        _; // <-- don't delete this, it is needed
    }
    
    // modifier used for the maintainers of the vault, the bank basically. The ones that created the contract.
    modifier onlyRegisteredUsers() {
        require(credentials[msg.sender].password > 0);
        require(credentials[msg.sender].salt > 0);
        _; // <-- don't delete this, it is needed
    }

    // generate contract 
    function Triage(){
	bank = msg.sender;
        totalSupply = 0;
    }

    // create an account on Triage
    function initializeAccount(uint256 _hashedUsername, uint256 _hashedPass, uint256 salt) onlyNewUsers(_hashedUsername, _hashedPass, salt) payable{
        
        // all the parameters have to be set
        require(_hashedUsername > 0);
        require(_hashedPass > 0);
        require(salt > 0);
        
        // set up account
        usernames[_hashedUsername] = msg.sender;
        credentials[msg.sender].password = _hashedPass;
        credentials[msg.sender].salt = salt;
	credentials[msg.sender].requestsIndex = 0;

	AccountInitialization(msg.sender);

        // deposit funds if the user sent some
        if(msg.value > 0){
            balances[msg.sender] += msg.value;
            totalSupply += msg.value;
            
            TokenCreation(msg.sender, msg.value);
        }
    }

    function changePass(uint256 _hashedPass, uint256 salt) onlyRegisteredUsers{
        credentials[msg.sender].password = _hashedPass;
        credentials[msg.sender].salt = salt;
    }
    
    // ====== create and burn SETH ====== //
    
    // create SETH
    function() onlyRegisteredUsers payable{

        balances[msg.sender] += msg.value;
        totalSupply += msg.value;
        
        TokenCreation(msg.sender, msg.value);
    }
     
     // burn SETH
     function withdraw(uint256 _amount){
         require(_amount <= balances[msg.sender]);

         balances[msg.sender] -= _amount;
         totalSupply -= _amount;
         TokenDestruction(msg.sender, _amount);
         
         msg.sender.transfer(_amount);
     }
     
    function getTotalSupply() returns (uint256 balance) {
        return totalSupply;
    }
     
    // ====== ERC 20 Part ====== //

    // Balances for each account
    mapping(address => uint256) balances;

     // Owner of account approves the transfer of an amount to another account
    mapping(address => mapping (address => uint256)) allowed;

    // What is the balance of a particular account?
    function balanceOf(address _owner) constant returns (uint256 balance) {
        return balances[_owner];
    }

    // Transfer the balance from owner's account to another account
    function transfer(address _to, uint256 _amount) returns (bool success) {
        if (balances[msg.sender] >= _amount 
            && _amount > 0
            && balances[_to] + _amount > balances[_to]) {
                
            balances[msg.sender] -= _amount;
            balances[_to] += _amount;
            Transfer(msg.sender, _to, _amount);
            
            return true;
        } else {
            return false;
        }
    }

    // Send _value amount of tokens from address _from to address _to
    // The transferFrom method is used for a withdraw workflow, allowing contracts to send
    // tokens on your behalf, for example to "deposit" to a contract address and/or to charge
    // fees in sub-currencies; the command should fail unless the _from account has
    // deliberately authorized the sender of the message via some mechanism; we propose
    // these standardized APIs for approval:
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) returns (bool success) {
        if (balances[_from] >= _amount
            && allowed[_from][msg.sender] >= _amount
            && _amount > 0
            && balances[_to] + _amount > balances[_to]) {
            
            balances[_from] -= _amount;
            allowed[_from][msg.sender] -= _amount;
            balances[_to] += _amount;
        
            return true;
        } else {
            return false;
        }
    }

    // Allow _spender to withdraw from your account, multiple times, up to the _value amount.
    // If this function is called again it overwrites the current allowance with _value.
    function approve(address _spender, uint256 _amount) returns (bool success) {
        allowed[msg.sender][_spender] = _amount;
        Approval(msg.sender, _spender, _amount);
        return true;
    }
    
    // Check whether spender is allowed to withdraw from owner
    function allowance(address _owner, address _spender) constant returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    event AccountInitialization(address indexed _account);
}

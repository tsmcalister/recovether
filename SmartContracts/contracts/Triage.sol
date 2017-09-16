pragma solidity ^0.4.11;

    contract TriageInterface {
         
        event TokenCreation(address indexed _from, uint _value);

        event TokenDestruction(address indexed _to, uint _value);

        event Transfer(address indexed _from, address indexed _to, uint _value);
        event Approval(address indexed _owner, address indexed _spender, uint _value);
    }

contract Triage is TriageInterface {
    
    // Minimal fee a user has to transmit together with the Fund Claiming Request (in percentage of the funds he wants to reclaim)
    // The user is advised to actually transmit 10%, but in case he'd receive some money in the mean time, we leave some space for the percentage to decrease.
    uint constant minFCReqFeePerc = 9;

    // Maximal fee a user can transmit together with the Fund Claiming Request (in percentage of the funds he wants to reclaim) for the request to still be valid
    uint constant maxFCReqFeePerc = 11;
    
    // Minimal amount of blocks that need to pass after having published the hash up to when the user may reveal the password.
    uint256 constant delayUntilPublishingPassword = 10; 

    // Minimal amount of time that needs to pass for a FC Request to be executed
    uint256 constant fcReqTimeLock = 3 weeks; 

    string public constant name = "Secure Ether";
    string public constant symbol = "SETH";
    uint8 public constant decimals = 18;  // similar to Ether
    uint256 public totalSupply; // variable
    address bank;

    struct Credentials {
        bytes32 password; // sha3(sha3(password) + salt)
        bytes32 salt;
        
        // index (pubKey of requester) => hash(hash(password) + newPubKey + salt)
        mapping(address => bytes32) claimFundsRequests;
        // index (pubKey of requester) => hash(hash(password) + amount of ether deposited for the request)
        mapping(address => uint256) depositedEther;
	// index (pubKey of requester) => hash(hash(password) + number of the block when the request was created)
	mapping(address => uint256) blockNumber;
    }
    
    // PubKey => Security related data
    mapping(address => Credentials) credentials;
    
    // hash(username) => pubKeys   // used for looking up which PubKey belongs to username, like a DNS
    mapping(bytes32 => address) usernames;

    // modifier used for the maintainers of the triage, the bank basically. The ones that created the contract.
    modifier onlyBank {
        require(msg.sender == bank);
        _; // <-- don't delete this, it is needed
    }

    // modifier used for the maintainers of the vault, the bank basically. The ones that created the contract.
    modifier onlyNewUsers(bytes32 _hashedUsername) {
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
    function initializeAccount(bytes32 _hashedUsername, bytes32 _doubleHashedPass, bytes32 salt) onlyNewUsers(_hashedUsername) payable{
        
        // all the parameters have to be set
        require(_hashedUsername > 0);
        require(_doubleHashedPass > 0);
        require(salt > 0);
        
        // set up account
        usernames[_hashedUsername] = msg.sender;
        credentials[msg.sender].password = _doubleHashedPass;
        credentials[msg.sender].salt = salt;

	AccountInitialization(msg.sender);

        // deposit funds if the user sent some
        if(msg.value > 0){
            balances[msg.sender] += msg.value;
            totalSupply += msg.value;
            
            TokenCreation(msg.sender, msg.value);
        }
    }

    function changePass(bytes32 _hashedPass, bytes32 salt) onlyRegisteredUsers{
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


    //  ====== Reclaiming funds ====== //
    
    function createClaimFundsRequest(bytes32 _hashedUsername, bytes32 _requestHash) payable{
        
        // check that request provides the appropriate deposit
        require(msg.value > balances[usernames[_hashedUsername]] / 100 * minFCReqFeePerc);
        require(msg.value < balances[usernames[_hashedUsername]] / 100 * maxFCReqFeePerc);
        
        // store the request hash  #spaghettiCodeParty
        credentials[usernames[_hashedUsername]].claimFundsRequests[msg.sender] = _requestHash;
        credentials[usernames[_hashedUsername]].depositedEther[msg.sender] = msg.value;
	    credentials[usernames[_hashedUsername]].blockNumber[msg.sender] = block.number;
    }
    
    function confirmFundsRequest(bytes32 _hashedUsername, bytes32 _singleHashedPw){
        
        // at least ten blocks must pass to get to phase two
        require(credentials[usernames[_hashedUsername]].blockNumber[msg.sender] + delayUntilPublishingPassword <= block.number);
        
        // check whether the given request hash can be reproduced with the now published password
        require(calculateRequestHash(_hashedUsername, _singleHashedPw, msg.sender) == credentials[usernames[_hashedUsername]].claimFundsRequests[msg.sender]);
        
        // check whether the user acutally owned the right password
        require(hashPassword(_singleHashedPw, credentials[usernames[_hashedUsername]].salt) == hashPassword(_singleHashedPw, credentials[usernames[_hashedUsername]].password));
        
        // Transfer the funds
        FundTransfer(usernames[_hashedUsername], msg.sender, balances[usernames[_hashedUsername]]);
        
        balances[msg.sender] = balances[usernames[_hashedUsername]];
        balances[usernames[_hashedUsername]] = 0;
        
    }
    
    function hashPassword(bytes32 _singleHashedPw, bytes32 salt) returns (bytes32 hash){
        return sha3(_singleHashedPw ^ salt);
    }
    
    function calculateRequestHash(bytes32 _hashedUsername, bytes32 _singleHashedPw, address pubKey) returns (bytes32 requestHash){
        return sha3(_singleHashedPw ^ credentials[usernames[_hashedUsername]].salt ^ sha3(pubKey));
    }
    
    event CFRequestInitialization(address _targetAccount, address _issuer);
    event AccountInitialization(address indexed _account);
    event ClaimingPeriodStart(address _target, address _issuer);
    event FundTransfer(address _from, address _to, uint _amount);
}

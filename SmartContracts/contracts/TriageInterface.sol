pragma solidity ^0.4.11;

contract TriageInterface {
     
    // create SETH
    function() payable;
    event TokenCreation(address indexed _from, uint _value);
     
    // burn SETH
    function withdraw();
    event TokenDestruction(address indexed _to, uint _value);
     
    // total supply is variable
    function getTotalSupply() returns (uint amount);
     
    // copied from ERC20 Standard (but removed constant totalSupply)
     
    function balanceOf(address _owner) constant returns (uint balance);
    function transfer(address _to, uint _value) returns (bool success);
    function transferFrom(address _from, address _to, uint _value) returns (bool success);
    function approve(address _spender, uint _value) returns (bool success);
    function allowance(address _owner, address _spender) constant returns (uint remaining);
    event Transfer(address indexed _from, address indexed _to, uint _value);
    event Approval(address indexed _owner, address indexed _spender, uint _value);
}

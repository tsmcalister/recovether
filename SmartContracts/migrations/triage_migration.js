var ConvertLib = artifacts.require("./TriageInterface.sol");
var MetaCoin = artifacts.require("./Triage.sol");

module.exports = function(deployer) {
  deployer.deploy(TriageInterface);
  deployer.link(TriageInterface, Triage);
  deployer.deploy(Triage);
};

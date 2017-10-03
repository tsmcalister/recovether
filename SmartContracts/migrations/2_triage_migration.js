var TriageInterface = artifacts.require("./TriageInterface.sol");
var Triage = artifacts.require("./Triage.sol");

module.exports = function(deployer) {
  deployer.deploy(Triage);
  deployer.link(Triage, TriageInterface);
  deployer.deploy(TriageInterface);
};

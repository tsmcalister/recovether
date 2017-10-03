var TriageInterface = artifacts.require("./TriageInterface.sol");
var Triage = artifacts.require("./Triage.sol");

module.exports = function(deployer) {
  deployer.deploy(TriageInterface);
  deployer.link(TriageInterface, Triage);
  deployer.deploy(Triage);
};

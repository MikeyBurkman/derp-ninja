
var eggnog = require('eggnog');

var context = eggnog.newContext({
	nodeModulesAt: __dirname + '/..' // need to backup to get to node_modules
});
context.addDirectory(__dirname);

context.main();

//context.printDependencies(context.getMainModuleId());
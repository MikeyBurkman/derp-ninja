
var eggnog = require('../../eggnog');

var context = eggnog.newContext({
	externalRoot: __dirname + '/..' // need to backup to get to node_modules
});
context.scanForFiles(__dirname);

context.main();

//context.printDependencies(context.getMainModuleId());
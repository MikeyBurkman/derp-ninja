
var eggnog = require('eggnog');

var context = eggnog.newContext();
context.scanForFiles(__dirname);

context.main();

//context.printDependencies(context.getMainModuleId());
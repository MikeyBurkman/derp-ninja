
var eggnog = require('eggnog');

var context = eggnog.newContext();
context.scanForFiles({
	baseDir: __dirname, 
	excludeFn: function(fname) {
	console.log('fname: ', fname);
	return false;
}});

context.main();

//context.printDependencies(context.getMainModuleId());
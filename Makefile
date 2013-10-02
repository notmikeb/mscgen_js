dev-build:
	echo "building mscgen parser from peg (web)  ..."
	pegjs --export-var var\ mscparser src/script/node/mscgenparser.pegjs src/script/mscgenparser.js
	echo "building mscgen parser from peg (node)  ..."
	pegjs src/script/node/mscgenparser.pegjs src/script/node/mscgenparser_node.js

	echo "building msgenny parser from peg (web) ..."
	pegjs --export-var var\ msgennyparser src/script/node/msgennyparser.pegjs src/script/msgennyparser.js
	echo "building msgenny parser from peg (node) ..."
	pegjs src/script/node/msgennyparser.pegjs src/script/node/msgennyparser_node.js

	echo "creating web variants of ast2*.js ..."
	sed s/module.exports/var\ tomscgen/g src/script/node/ast2mscgen.js > src/script/ast2mscgen.js
	sed s/module.exports/var\ tomsgenny/g src/script/node/ast2msgenny.js > src/script/ast2msgenny.js

	echo "assembling css"
	r.js -o dev-build.css.js

build:
	echo "building mscgen parser from peg (web)  ..."
	pegjs --export-var var\ mscparser src/script/node/mscgenparser.pegjs src/script/mscgenparser.js
	echo "building mscgen parser from peg (node)  ..."
	pegjs src/script/node/mscgenparser.pegjs src/script/node/mscgenparser_node.js

	echo "building msgenny parser from peg (web) ..."
	pegjs --export-var var\ msgennyparser src/script/node/msgennyparser.pegjs src/script/msgennyparser.js
	echo "building msgenny parser from peg (node) ..."
	pegjs src/script/node/msgennyparser.pegjs src/script/node/msgennyparser_node.js

	# TODO: test for existence of sed (and what to do if it isn't there?)
	echo "creating web variants of ast2*.js ..."
	sed s/module.exports/var\ tomscgen/g src/script/node/ast2mscgen.js > src/script/ast2mscgen.js
	sed s/module.exports/var\ tomsgenny/g src/script/node/ast2msgenny.js > src/script/ast2msgenny.js

	echo "optimizing css and javascript with r.js ..."
	# TODO: test for existence of r.js (and npm it if not there/ or use
	# cp yadda-src.js yadda.js which also works but isn't as efficient
	# on page loading)
	for i in build.*$1*.js; do
		r.js -o $i
	done

	cp src/index.html index.html
	mkdir lib
	cp src/lib/require.js lib/require.js
	mkdir images
	cp src/images/* images/.
	mkdir samples
	cp src/samples/*.mscin samples/.
	cp src/samples/*.msgenny samples/.
    
deploy: build
	git checkout gh-pages
	git merge master -m "merge for gh-pages build"
	sh build.sh
	git add .
	git commit -a -m "build"
	git push
	git checkout master

clean:
	rm -rf style script lib images samples index.html

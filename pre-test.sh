#!/bin/bash

# Split the content file at the first occurence of a function
csplit -f temp -s src/content.js '/^function /'
rm temp00

echo "// THIS IS AN AUTOMATICALLY GENERATED FILE. DO NOT EDIT.\n" > test/mainLogic.js
echo "const $ = require('../src/third-party/jquery-3.4.0.min.js');\n" >> test/mainLogic.js
cat temp01 >> test/mainLogic.js
echo "module.exports = {" >> test/mainLogic.js

# The sed command finds lines that begin 'function'. The awk command removes
# everything after the first '(' (inclusive), so we are left with just the fn names.
cat temp01 | sed -n -e 's/^function //p' | awk -F '\\(' '{print $1","}' >> test/mainLogic.js
echo "}" >> test/mainLogic.js

rm temp01

# Finally, download a search result from Google Scholar for testing with
curl -sA "Chrome" -L 'https://scholar.google.co.uk/scholar?q=how+long+is+a+hillslope' -o test/fixtures/scholar.html

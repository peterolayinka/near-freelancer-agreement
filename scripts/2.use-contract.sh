#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 0: Check for environment variable with contract name"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

echo
echo
echo ---------------------------------------------------------
echo "Step 1: Call 'view' functions on the contract"
echo
echo "(run this script again to see changes made by this file)"
echo ---------------------------------------------------------
echo

# near call $CONTRACT create_project '{"title": "tata", "description": "tamtam", "contractor": "test.peterolayinka.testnet"}' --accountId peterolayinka.testnet --amount 2

# near call $CONTRACT latest_projects  --accountId peterolayinka.testnet

#  near call $CONTRACT project_created  --accountId peterolayinka.testnet

#  near call $CONTRACT project_assigned  --accountId peterolayinka.testnet

# near call $CONTRACT project_detail '{"id": 0}' --accountId $CONTRACT

# near call $CONTRACT update_status '{"id":0, "status": "PAID"}' --accountId $CONTRACT

# near call $CONTRACT reassign_contractor '{"id": 0, "contractor": "big.peterolayinka.testnet"}'  --accountId peterolayinka.testnet


echo
echo

near view $CONTRACT read '{"key":"some-key"}'

echo
echo
echo ---------------------------------------------------------
echo "Step 2: Call 'change' functions on the contract"
echo ---------------------------------------------------------
echo

# the following line fails with an error because we can't write to storage without signing the message
# --> FunctionCallError(HostError(ProhibitedInView { method_name: "storage_write" }))
# near view $CONTRACT write '{"key": "some-key", "value":"some value"}'
near call $CONTRACT write '{"key": "some-key", "value":"some value"}' --accountId $CONTRACT

echo
echo "now run this script again to see changes made by this file"
exit 0

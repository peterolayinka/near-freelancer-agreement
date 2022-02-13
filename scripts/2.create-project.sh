#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 0: Check for environment variable with contract name"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$ACCOUNT" ] && echo "Missing \$ACCOUNT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"
[ -z "$ACCOUNT" ] || echo "Found it! \$ACCOUNT is set to [ $ACCOUNT ]"

echo
echo
echo ---------------------------------------------------------
read -p 'Project Title: ' title
read -p 'Description: ' description
read -p 'Contractor: ' contractor
read -p 'Budget: ' budget
echo

_command='{"title": "'$title'", "description": "'$description'", "contractor": "'$contractor'"}'

echo $_command

near call $CONTRACT create_project "${_command}" --accountId $ACCOUNT --amount $budget

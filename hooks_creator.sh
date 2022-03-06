#!/bin/bash
# Set location to script location
cd "$(dirname "$0")"

cd .git/hooks

echo "#!/bin/bash" > pre-commit
echo "cd backend/" >> pre-commit
echo "./gradlew task check" >> pre-commit
echo "RESULT=$?" >> pre-commit
echo "[ \$RESULT -ne 0 ] && exit 1" >> pre-commit
echo "exit 0" >> pre-commit

echo "cd ../frontend/" >> pre-commit
echo "npm run lint" >> pre-commit
echo "RESULT=$?" >> pre-commit
echo "[ \$RESULT -ne 0 ] && exit 1" >> pre-commit

echo "npx prettier --check ." >> pre-commit
echo "RESULT=$?" >> pre-commit
echo "[ \$RESULT -ne 0 ] && exit 1" >> pre-commit

chmod u+x pre-commit

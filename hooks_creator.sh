#!/bin/bash
# Set location to script location
cd "$(dirname "$0")"

cd .git/hooks

# Create a message hook. this is a not really comatible with suggested use but we need the message so it will do.

# Setup commit-msg hook
echo "#!/bin/bash" > commit-msg

echo "failMassage=\"Commit: FAILED." >> commit-msg
echo "If you want to commit anyway, start message with (broken).\"" >> commit-msg
echo "succesMessage=\"Commit: SUCCESS\"" >> commit-msg
echo "brokenMessage=\"Message contains (broken). Commit is allowed.\"" >> commit-msg

echo "" >> commit-msg
echo "broken=\$(grep \"(broken)\" \"\$1\")" >> commit-msg

echo "" >> commit-msg
echo "cd backend/" >> commit-msg
echo "./gradlew task check" >> commit-msg
echo "RESULT=\$?" >> commit-msg
echo "[ \$RESULT -ne 0 ] && [[ -z \$broken ]] && echo \"\$failMassage\" && exit 1" >> commit-msg

echo "" >> commit-msg
echo "cd ../frontend/" >> commit-msg
echo "npm run lint" >> commit-msg
echo "RESULT=\$?" >> commit-msg
echo "[ \$RESULT -ne 0 ] && [[ -z \$broken ]] && echo \"\$failMassage\" && exit 1" >> commit-msg

echo "npm run test" >> commit-msg
echo "RESULT=\$?" >> commit-msg
echo "[ \$RESULT -ne 0 ] && [[ -z \$broken ]] && echo \"\$failMassage\" && exit 1" >> commit-msg

# echo "npx prettier --check ." >> commit-msg
echo "npx prettier --check ." >> commit-msg
echo "RESULT=\$?" >> commit-msg
echo "[ \$RESULT -ne 0 ] && [[ -z \$broken ]] && echo \"\$failMassage\" && exit 1" >> commit-msg

echo "" >> commit-msg
echo "[[ -n \$broken ]] && echo \"\$brokenMessage\"" >> commit-msg
echo "[[ -z \$broken ]] && echo \"\$succesMessage\"" >> commit-msg

echo "exit 0" >> commit-msg

chmod u+x commit-msg

# Add pre-commit prettier
echo "#!/bin/bash" > pre-commit
echo "failMassage=\"Prettier failed.\"" >> pre-commit
echo "cd frontend/" >> pre-commit
echo "npx prettier --write ." >> pre-commit
echo "RESULT=\$?" >> pre-commit
echo "[ \$RESULT -ne 0 ] && echo \"\$failMassage\" && exit 1" >> pre-commit
echo "exit 0" >> pre-commit

chmod u+x pre-commit

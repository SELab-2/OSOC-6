# General development tools

## hooks_creator.sh
The root directory contains a script called `hooks_creator.sh`.
Running this script once creates a hook that perform some local checks before committing.
More precisely the gradle `check` task will be run.
This will lint your code and execute the tests.
Failure of this task will result in failure to push.
When changes to the script are made, please do run it again. 

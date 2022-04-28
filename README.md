# OSOC-6

## Manual

A [manual on how to use the tool](documentation/OSOC-tool-manual.pdf) is available as a pdf.
It doesn't contain a lot of information since we have not yet started working on the front end.

## Documentation

Documentation as proposed in
[the assignment document](https://github.com/SELab-2/OSOC-opgave/blob/main/opgave.md#algemeen) for each milestone.

### Architecture

We constructed diagrams to clarify our code.
Additionally, we supply [use-cases](documentation/use-case.pdf),
a [domain-model](documentation/domain-model.html) (made in drawio) and
a [description of our API](https://selab-2.github.io/OSOC-6/) (made in swagger).

#### Deployment diagram

We provide an overview of the different layers, the technologies used within those layers and
how they communicate in our [deployment diagram](documentation/OSOC-deployment-diagram.vpd.svg).

#### Component overview

An overview and small description of our most important modules,
the layers they are used in and the modules they communicate with is provided in
our [module overview](documentation/OSOC-component-servicediagram.vpd.svg).

### Design

Besides class diagrams and interaction diagrams,
we also [provide a detailed documentation of our back end packages and Types](backend-java-api).
You can check this documentation in the browser by running `npx serve` in the `backend-java-api` folder.

#### Class diagrams

We provide [class diagrams](documentation/class-diagrams) to show the structure of our most important classes.

#### Sequence Diagrams

In our [sequence diagram](documentation/sequence-diagrams) you can see our most important object interactions.

### Installation

Start by cloning the repository.
Do this by pulling this project from GitHub.
The easiest way is by just cloning the repository over https, but this might not work.
```
git clone https://github.com/SELab-2/OSOC-6.git
```
To fix this, we will need to clone via SSH.
Go to your account settings (https://github.com/settings/keys) and add your public ssh key (`~/.ssh/id_rsa.pub`).
Now we can use the following command to clone the repository.
```
git clone git@github.com:SELab-2/OSOC-6.git
```

Further setup is explained for
[front end](frontend/README.md#setup) and  [back end](backend/README.md#setup) individually.

### Test

[Front end](frontend/README.md#tests): 68.42%
[Back end](backend/README.md#tests): 100%

Backend test coverage is 100% and should be kept that way.
Our frontend test coverage is not vary high since we are prioritizing the implementation of all components first.

## Team

* Project leader: Jitse De Smet
* System manager: Ruben Van Mello
* API manager: Thomas Van Mullem
* Test manager: Anne Depuydt
* Documentation manager: Kasper Demeyere
* Customer Relations Officer: Lukas Van Rossem

## Developers

Developers information can be found in the dedicated documentation folder.
We have [documentation for back end](backend/README.md),
[documentation for front end](frontend/README.md) and [documentation for server deployment](serverSetup.md).

### Hooks

Running the `hooks_creator.sh` script will create hooks that makes git check your commits.
This way you can already see if a commit works locally.
We advise marking commits that fail with a commit message starting with `(broken)`.
A commit following this format will get tested but the commit will be executed regardless of the tests.

### Git branch names

We think it's important to find a branch quickly, that's why we have rules regarding branch names in this project.
The rules are described in #37.
We use the following structure: `{dir-name}/{issue-nr}-{description}`.
The dir-name is a name matching the label of the issue.
We use following names:
* management
* feature-frontend
* feature-backend
* feature-databse
* bugfix
* documentation
* test
* refactoring

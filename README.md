# OSOC-6

## [Name (#8)]
Coverage: 

## Documentation

Documentation as proposed in [the assignment document](https://github.com/SELab-2/OSOC-opgave/blob/main/opgave.md#algemeen) for each milestone.

### Architecture

#### Deployment diagram

#### Component/module overview

### Design

#### Class diagrams

#### Interaction or sequence diagrams

### Installation

### Test

### Manual

## Team

* Project leader: Jitse De Smet: Likes: oversharing, being weird, climbing. Dislikes: **mean** grammar nazis
* System manager: Ruben Van Mello
* API manager: Thomas Van Mullem
* Test manager: Anne Depuydt
* Documentation manager: Kasper Demeyere
* Customer Relations Officer: Lukas Van Rossem

## Developers

### Hooks

Running the `hooks_creator.sh` script will create hooks that makes git check your commits.
This way already see if a commit works locally.
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

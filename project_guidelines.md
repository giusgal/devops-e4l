# DevOps course: Activities guidelines

 

## September 2025

# Introduction

This document presents the different kind of activities a student has to do along the course. Each of these activities is done individually.  

# Homeworks

## Readings

A list of readings is provided aimed at complementing the theoretical material presented during the session.   
This reading material is taken as the baseline for the in-class assessment taking place (likely) at the last session of the course. This assessment is made using Multiple Choice Questions (MCQs). The questions are aimed to assess whether the student has read the given material, as well as the level of comprehension and understanding of such reading material. 

## Assignments

An assignment consists of one or more exercises that are to be submitted. These exercises are given at the end of a session. These exercises are aimed at helping the student develop assets that may be used as part of the project deliverable to be submitted at the end of the course. Each assignment is to be submitted by the student via Moodle before the following session starts. **The assignment is individual.** A student may (or may not) be requested to explain his/her solution of the assignment during the session that follows the submission. 

# Project

The project consists in the design and implementation of a Deployment Pipeline. The engineered Deployment Pipeline is expected to meet the following functional and non-functional requirements:

## Functional Requirements (FR)

- Team members can work on different versions of the system concurrently.  
- Code developed by one team member does not overwrite code developed by others.  
- Code produced by one team can be integrated with code produced by other teams.  
- Code is the same during different stages  
- Different environments serve different purposes.  
- Different environments are isolated from each other.  
- A deployment can be easily rolled back if there is a problem.

 

## Non-Functional Requirements (NFR)

The word “ility” is used to describe **quality** concerns other than those that focus on the functionalities. The quality of a system is “*the degree to which the system satisfies the stated and implied needs of its various stakeholders, and thus provides value*.” (ISO/IEC 25010:2011(E). In the context of the project, the “ilities” of the Deployment Pipeline correspond to the qualities concerns of the pipeline itself rather than the product the pipeline produces and operates on.

The targeted “ilities” are those enumerated in the ISO/IEC standard named “*ISO/IEC 25010 \- Systems and software engineering \- Systems and software Quality Requirements and Evaluation (SQuaRE) \- System and software quality models*.” (2011, ISO/IEC 13211-1). This standard proposes eight characteristics (functional suitability, reliability, performance efficiency, usability, security, compatibility, maintainability and portability), which are composed of a set of related sub-characteristics. 

The engineered infrastructure (known as DevOps environment \-DevOpsEnv) aimed at implementing the deployment pipeline is expected to meet **some** of these characteristics, with special emphasis (but not limited to) on **reliability, performance efficiency, and maintainability**.

Each NFR being addressed has to be duly justified. This means that explanations about how such NFR is met have to be provided. These explanations can rely on **design choices** (i.e. the justification is given in terms of the components that make the architecture of the pipeline) and/or **empirical experiments** (i.e. an experiment is designed to provide empirical evidence that support the claim \-remark: a scenario that allows recreating the experiments has to be provided).  

It is worth mentioning that it is possible to address a NFR over a set of components only, rather than the whole pipeline. This would help not only reduce the workload related to the justification of meeting such a NFR, but also apply an incremental approach towards the coverage of the NFR over the whole pipeline.   
 

## **Constraints**

The project has to be made according to certain (intentionally) imposed constraints. The aim of this is to establish a certain homogeneity such that the level of complexity is common to every student working to attain a solution to the project.  
These constraints are listed next: 

- Management  
  - The actual number of members doing the same project will depend on the number of students enrolled in the course. Thus, it may range from a solo project to a group of up to 3 members.  
- Technologies  
  - Open-source  
  - OS is Unix-based  
  - It cannot be cloud-based (i.e. your solution must work on a similar computer as the one you used to develop the project).  
- Product:   
  - It is the same for every group.   
  - Information about the product, its requirements, design and how to retrieve it is given during the course.   
  - **Remarks regarding the product:**   
    - The product itself is not evaluated.  
    - **You need to make modifications to the product**. For that, guidelines about the product are provided to explain how to get it running, but not how to make changes. It is up to you to understand the code to implement the changes.  
    - These changes are used to show **HOW THE PIPELINE FUNCTIONS:** i.e. it shows how each change makes it in production.  
    - These changes must be duly documented as part of the scenarios they help to showcase.  
- Testing:   
  - There must exist at **least one** automated test case of type:  
    - Unit test  
    - Integration test  
    - User-acceptance test  
  - These automated test cases must be run every time the pipeline is executed. Thus, not only the test cases must be provided as part of the solution, but also the Scenarios.txt must contain information that shows these test cases passing and failing.   
  - **Remarks regarding the test cases:**  
    - There exists one or more testing frameworks to implement and run test cases for the given product. It is up to you to look for and find these testing frameworks.  
    - The usefulness of the provided test cases is not evaluated.


## Milestones

The design and implementation of a Deployment Pipeline is achieved by a sequence of milestones. The actual purpose of these milestones is to serve as guideline towards the creation of the project’s final solution in an incremental manner. Therefore, it is a good advice to follow these milestones when engineering the solution for the given project:

1. Walking skeleton  
   1. Smallest possible amount of work to get the key elements in place.   
2. Setup of environments  
   1. Prod and Test (also referred to as “Staging”) environments  
3. Continuous integration (CI) server setup  
   1. Integration environment  
   2.  Automated build  
   3. Automated unit test cases execution  
4. Continuous deployment (CD) setup  
   1. Automated deploy  
   2. Automated release  
5. Automated testing  
   1. Automated integration test cases  
   2. Automated user acceptance test cases

   

 

## Deliverable

The result of having made the project is a collection of artefacts**.** This collection is referred to as **the deliverable.** 

The **deliverable** must be packaged in one single file at the moment of doing **the actual final submission**. This must be a .zip file containing every single artefact. Next, the list with the minimal elements that must compose the deliverable is given:

- The source files of the given product.  
- The source files of the test cases associated to the product.  
- The resources (e.g. scripts, configuration and data files) required to setup the Deployment Pipeline.  
- A **readme.tx**t file that explains how to use all the previous items to setup the Deployment Pipeline in a given state.  
- A **scenarios.txt** file that contains enough show cases **(at least 2\)** that allow to demonstrate the correct functioning of the Deployment Pipeline.

**Important remark**: It is expected that the explanations provided both in the readme.txt and scenarios.txt files are precise enough to let not only recreate the pipeline in a given state, but also to reproduce the scenarios. This information is crucial to prove the correctness of the work done (more details in the Assessment criteria section, below).  
 

## Assessment criteria 

The criteria are defined based on what it was asked to be delivered:

* Readme.txt  
* Scenarios.txt  
* Artefacts  
  * Your own version of the Product.  
  * Test cases related to your version of the product   
  * Resources to build up the pipeline according to guidelines provided in the Readme.txt file

The grading will be based on two main components : 

* **Contribution grade:** aimed to evaluate if you have been able to provide the deliverables with all relevant contributions: pipeline setup, test cases and scenarios. It will be graded **on a basis of 10 points.**  
* **Automatisation grade:** aimed to evaluate how much of the setup you have been able to automate. It includes the automatisation of the pipeline setup as well as the setup of every required environment. It will be graded as a percentage of the number of steps you have been able to automate **on a total of 20 points.**

The final grade will be computed by the product of the contribution grade and the automatisation grade divided by 2\. **This means that your final grade will be capped by the amount of code you have been able to automate** : this is the main added-values that you will have to provide in this project. 

Here are the details of the grading methodology : 

* **Contribution grade (10 points):**   
1. Reproduce Dev, Stage, and Prod environments (2 points)  
2. Product setup on Development environment (1 point)  
3. CI/CD server including pipeline for product (2 points)   
4. Product  setup on Staging/Production environment (2 points)   
5. Test cases in Staging Environment (2 points)   
6. Scenarios in Production Environment (1 point)  
* **Automatisation grade (20 points) :**   
1. Dev environment setup (3 points)  
2. Product setup on Dev environment (3 points)   
3. Staging/Production environment (5 points)   
4. CI/CD server including pipeline for product (5 points)  
5. Test cases in Staging environment (4 points) 

**Final grade (100 points) \= Contribution \* Automatisation2**

The objective of this grading is to push you forward to automatise the whole deployment process, from the initialisation of the VM until the pipeline that leads to the final product being uploaded into production environment after testing in the stage environment. 
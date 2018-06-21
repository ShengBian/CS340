-- For Student List
-- get all program programCode and name to populate program dropdown
SELECT programCode, name FROM program

-- get all students and their program name for the student list page
SELECT number, program.name, isInternational, collegeId, balance FROM student INNER JOIN program ON student.programCode = program.programCode

-- get a single student's data for the update Student form
SELECT number, programCode, isInternational, collegeId, balance FROM student WHERE number = [number_selected_from_browse_student_page]

-- add a new student
INSERT INTO student (number, programCode, isInternational, collegeId, balance) VALUES ([numberInput], [program_code_from_dropdown_Input], [isInternational_from_checkbox], [collegeIdInput], [balanceInput])

-- update a student's data based on submission of the Update Student Form
UPDATE student SET number=[numberInput], programCode=[program_code_from_dropdown_Input], isInternational=[isInternational_from_checkbox_input], collegeId=[collegeIdInput], balance=[balanceInput] WHERE number = [student_number_selected_from_browse_student_page]

-- delete a student
DELETE FROM student WHERE number = [student_number_selected_from_browse_student_page]

-- For Person List
-- get all people for the person list page
SELECT number, lastName, firstName, phoneNumber, email, birthdate FROM person

-- get a single person's data for the update person form
SELECT number, lastName, firstName, phoneNumber, email, birthdate FROM person WHERE number = [number_selected_from_browse_person_page]

-- add a new person
INSERT INTO person (number, lastName, firstName, phoneNumber, email, birthdate) VALUES ([numberInput], [lastNameInput], [firstNameInput], [phoneNumberInput], [emailInput], [birthdateInput])

-- update a person's data based on submission of the Update Person Form
UPDATE person SET number=[numberInput], lastName=[lastNameInput], firstName=[firstNameInput], phoneNumber=[phoneNumberInput], email=[emailInput], birthdate=[birthdateInput] WHERE number = [number_selected_from_browse_person_page]

-- delete a person
DELETE FROM person WHERE number = [number_selected_from_browse_person_page]

-- For Course List
-- get all courses for the course list page
SELECT courseCode, name, hours, credits FROM course

-- get a single course's data for the update course form
SELECT courseCode, name, hours, credits FROM course WHERE courseCode = [courseCode_selected_from_browse_course_page]

-- add a new course
INSERT INTO course (courseCode, name, hours, credits) VALUES ([courseCodeInput], [nameInput], [hoursInput], [creditsInput])

-- update a course's data based on submission of the Update Course Form
UPDATE course SET courseCode=[courseCodeInput], name=[nameInput], hours=[hoursInput], credits=[creditsInput] WHERE courseCode = [courseCode_selected_from_browse_course_page]

-- delete a course
DELETE FROM course WHERE courseCode = [courseCode_selected_from_browse_course_page]

-- For program list
-- get all programs for the program list page
SELECT programCode, name, college FROM program

-- get a single program's data for the update program form
SELECT programCode, name, college FROM program WHERE programCode = [programCode_selected_from_browse_program_page]

-- add a new program
INSERT INTO program (programCode, name, college) VALUES ([programCodeInput], [nameInput], [collegeInput])
 
-- update a program's data based on submission of the Update Program Form 
UPDATE program SET programCode=[programCodeInput], name=[nameInput], college=[collegeInput] WHERE programCode = [programCode_selected_from_browse_program_page]
 
-- delete a program
DELETE FROM program WHERE programCode = [programCode_selected_from_browse_program_page]

-- For Payment LIST
-- get all payments for the payment list page
SELECT id, studentNumber, invoiceNumber, transactionDate, amount FROM payment

-- get a single payment's data for the update payment form
SELECT id, studentNumber, invoiceNumber, transactionDate, amount FROM payment WHERE id = [id_selected_from_browse_payment_page]

-- add a new payment
INSERT INTO payment (studentNumber, invoiceNumber, transactionDate, amount) VALUES ([student_number_from_dropdown_input], [invoiceNumberInput], [transactionDateInput], [amountInput])

-- update a payment's data based on submission of the Update Payment Form 
UPDATE payment SET studentNumber=[student_number_from_dropdown_input], invoiceNumber=[invoiceNumberInput], transactionDate=[transactionDateInput], amount=[amountInput] WHERE id = [id_selected_from_browse_payment_page]

-- DELETE a payment
DELETE FROM payment WHERE id = [id_selected_from_browse_payment_page]

-- for course and student(person) association page
-- get all people's data to populate a dropdown for associating with a course
SELECT number, lastName, firstName FROM person
-- get all courses's data to populate a dropdown for associating with a person
SELECT courseCode, name FROM course

-- get all people with their current courses they are taking
SELECT student_course.studentNumber, student_course.courseCode, CONCAT(firstName,' ',lastName) AS studentName, course.name AS courseName
FROM person
INNER JOIN student_course ON person.number = student_course.studentNumber
INNER JOIN course ON student_course.courseCode = course.courseCode
ORDER BY studentName, courseName

-- associate a person with a course (M-to-M relationship addition)
INSERT INTO student_course (studentNumber, courseCode) VALUES ([student_number_from_dropdown_Input], [course_code_from_dropdown_Input])

-- dis-associate a course from a person (M-to-M relationship deletion)
DELETE FROM student_course WHERE studentNumber = [student_number_selected_from_student_and_course_list] AND courseCode = [student_number_selected_from_student_and_course_list]

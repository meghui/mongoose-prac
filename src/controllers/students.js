const Student = require('../models/student');
const Course = require('../models/course');

async function getAllStudents(req, res) {
	const students = await Student.find().exec();
	return res.json(students);
}

async function getStudentById(req, res) {
	const { id } = req.params;
	const student = await Student.findById(id)
		.populate('courses', 'name description -_id')
		.exec();
	if (!student) {
		return res.status(404).json({
			error: 'Student not founc'
		});
	}
	return res.json(student);
}

async function addStudent(req, res) {
	const { firstName, lastName, email } = req.body;

	const student = new Student({
		firstName,
		lastName,
		email
	});
	await student.save();
	return res.status(201).json(student);
}
async function updateStudentById(req, res) {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;

  const student = await Student.findByIdAndUpdate(
    id,
    { firstName, lastName, email },
    { new: true }
  ).exec();
  if (!student) {
    return res.status(404).json({ error: 'student not found' });
  }
  return res.json(student);
}

async function deleteStudentById(req, res) {
  const { id } = req.params;
  const student = await Student.findByIdAndDelete(id).exec();
  if (!student) {
    return res.status(404).json({ error: 'student not found' });
  }
	//remove the link between student and course after deleteing student
	await Course.updateMany(
	{ students: student._id },
	{
	$pull: {
		students: student._id,
	},
	}
	).exec();
  return res.sendStatus(204);
}

async function addCourseToStudent(req, res) {
  const { id, code } = req.params;
  const course = await Course.findById(code).exec();
  const student = await Student.findById(id).exec();
	if (!student || !course) {
		return res.status(404).json({ error: 'student or course not found' })
	}
	student.courses.addToSet(course._id);
	course.students.addToSet(student._id);
	await student.save();
	await course.save();
	return res.json(student);
}
async function removeCourseFromStudent(req, res) {
  const { id, code } = req.params;
  const course = await Course.findById(code).exec();
  const student = await Student.findById(id).exec();
	if (!student || !course) {
		return res.status(404).json({ error: 'student or course not found' })
	}
	student.courses.addToSet(course._id);
	course.students.addToSet(student._id);
	await student.save();
	await course.save();
	return res.json(student);
}

module.exports = {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudentById,
  deleteStudentById,
  addCourseToStudent,
  removeCourseFromStudent
};

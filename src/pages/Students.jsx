import AddStudentForm from '../components/AddStudentForm'
import StudentList from '../components/StudentList'
import ViewStudentDetail from './ViewStudentDetail'

const Students = () => {
    return (
        <div>
            <AddStudentForm />
            <hr />
            <StudentList />
            <ViewStudentDetail/>
        </div>
    )
}

export default Students
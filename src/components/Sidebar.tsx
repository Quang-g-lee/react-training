import { NavLink} from "react-router-dom"

function Sidebar() {
    const lessons = [1, 2, 3, 4, 5, 6, 7, 8]

    return (
        <aside className="sidebar">
            {lessons.map((lesson) => (
                <NavLink
                    key={lesson}
                    to={`/exercises/${lesson}`}
                    className={({ isActive }) => isActive ? 'lesson-link active' : 'lesson-link'}
                >
                    Lesson {lesson}
                </NavLink>
            ))}
        </aside>
    )
}

export default Sidebar
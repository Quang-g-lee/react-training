import { useParams } from "react-router-dom";
import UserTable from "../components/UserTable";
import { mockUsers } from "../data/mockUsers";
import UserValidationForm from '../components/UserValidationForm'

function ExerciseDetail() {
    const { id } = useParams();

    if (id === '1') {
        return (
            <section>
                <h1>Khởi tạo dự án</h1>
                <ol className="lesson-steps">
                    <li>
                        <strong>Khởi tạo react ts với vite</strong> :{' '}
                        <a href="https://vitejs.dev/guide/">https://vitejs.dev/guide/</a>
                    </li>
                    <li>
                        <strong>Sửa lại nội dung file eslint</strong> :{' '}
                        <a href="https://github.com/Quang-g-lee/react-training/blob/main/.eslintrc.cjs">
                            https://github.com/Quang-g-lee/react-training/blob/main/.eslintrc.cjs
                        </a>
                    </li>
                    <li><strong>Upload code lên github</strong></li>
                </ol>
            </section>
        );
    }

    if (id === '2') {
        return (
            <section>
                <h1>Thực hành router</h1>
                <p>
                    Sử dụng react-router-dom để tổ chức router cho các màn sau: Đăng nhập,
                    đăng ký, quên mật khẩu, welcome page, danh sách bài tập, chi tiết bài tập,
                    layout sau khi đăng nhập (header, sidebar).
                </p>
                <p>Sử dụng Redux để lưu trạng thái đăng nhập.</p>
            </section>
        );
    }

    if (id === '3') {
        return (
            <UserTable users={mockUsers} />
        )
    }

    if (id === '4') {
        return (
            <section>
                <h1>Thực hành validate form</h1>
                <h2>Thực hành validate form - onBlur</h2>

                <UserValidationForm mode="onBlur" />

                <h2>Thực hành validate form - onSubmit</h2>

                <UserValidationForm mode="onSubmit" />
            </section>
        )
}

    return <h1>Chi tiết bài tập {id}</h1>;
}

export default ExerciseDetail;

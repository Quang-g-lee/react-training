import { useParams } from "react-router-dom";

function ExerciseDetail() {
    const { id } = useParams();

    if (id !== '1') {
        return <h1>Chi tiết bài tập {id}</h1>;
    }

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

export default ExerciseDetail;

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import { RoomCode } from '../components/RoomCode'
import { database } from '../services/firebase'

import { useParams } from 'react-router-dom'

import "../styles/room.scss"
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'
import { Button } from '../components/Button'

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);

    async function handleDeleteQuestion(questionId: String) {
        if (window.confirm('Tem certeza que deseja excluir esta pergunta ?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetMeAsk" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined>Encerrar sala</Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala: {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s) </span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            >
                                <button
                                    type='button'
                                    onClick={() => handleDeleteQuestion(question.id)}>
                                    <img src={deleteImg} alt="Excluir pergunta" />
                                </button>
                            </Question>
                        );
                    })}
                </div>

            </main>
        </div >
    )
}
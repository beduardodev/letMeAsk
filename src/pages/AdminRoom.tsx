import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import { RoomCode } from '../components/RoomCode'
import { database } from '../services/firebase'

import { useHistory, useParams } from 'react-router-dom'

import "../styles/room.scss"
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'
import { Button } from '../components/Button'

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const { questions, title } = useRoom(roomId);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })
        history.push('');
    }

    async function handleDeleteQuestion(questionId: String) {
        if (window.confirm('Tem certeza que deseja excluir esta pergunta ?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string, questionIsAnswered: boolean) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: !questionIsAnswered,
        })

    }
    async function handleHighlightedQuestion(questionId: string, questionisHighLighted: boolean) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: !questionisHighLighted,
        })
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetMeAsk" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
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
                                isAnswered={question.isAnswered}
                                isHighLighted={question.isHighLighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type='button'
                                            onClick={() => handleCheckQuestionAsAnswered(question.id, question.isAnswered)}>
                                            <img src={checkImg} alt="Marcar pergunta como respondida." />
                                        </button>
                                        <button
                                            type='button'
                                            onClick={() => handleHighlightedQuestion(question.id, question.isHighLighted)}>
                                            <img src={answerImg} alt="Responder pergunta" />
                                        </button>
                                    </>
                                )}
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



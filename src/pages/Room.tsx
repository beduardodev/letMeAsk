import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'

import { useParams } from 'react-router-dom'

import "../styles/room.scss"
import { FormEvent, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'
import { Question } from '../components/Question'
import { useRoom } from '../hooks/useRoom'

type RoomParams = {
    id: string;
}

export function Room() {
    const { user } = useAuth();
    const params = useParams<RoomParams>();
    const [newQuestion, setNewQuestion] = useState('');
    const roomID = params.id;
    const { questions, title } = useRoom(roomID);

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            return
        }

        if (!user) {
            throw new Error('You must be logged in');
        }

        const question = {
            content: newQuestion,
            author: {
                name: user.name,
                avatar: user.avatar,
            },
            isHighLighted: false,
            isAnswered: false,
        };

        await database.ref(`rooms/${roomID}/questions`).push(question);

        setNewQuestion('');
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetMeAsk" />
                    <RoomCode code={roomID} />
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala: {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s) </span>}
                </div>
                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder='Qual a sua pergunta ?'
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className='form-footer'>
                        {user ? (
                            <div className='user-info'>
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta, e necessario realizar o <button>Login</button>.</span>
                        )}
                        <Button type='submit' disabled={!user}>Enviar pergunta</Button>
                    </div>
                </form>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            />
                        );
                    })}
                </div>

            </main>
        </div >
    )
}
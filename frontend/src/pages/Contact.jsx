import React, { useState, useRef, useEffect } from "react";
import { composeInitialProps, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Contact = () => {
    const { t } = useTranslation()
    const [content, setContent] = useState('')
    const [email, setEmail] = useState('')
    const [emailCom, setEmailCom] = useState('')
    const [complete, setComplete] = useState(false);
    const [reportId, setReportId] = useState('');
    const [returnedEmail, setReturnedEmail] = useState('');

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (email !== emailCom) {
            console.log('メールアドレスが一致しません')
            alert('メールアドレスが一致しません')
            return;
        }
        try {
            const res = await fetch('/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify ({
                    'email': email,
                    'content': content
                })
            })
            if (!res.ok) {
                console.log('エラーが発生しました')
            }
            const result = await res.json();
            const { id, email: respEmail } = result;
            console.log('Report ID:', id, 'Email:', respEmail);
            setReportId(id);
            setReturnedEmail(respEmail);
            setComplete(true);
        } catch (err) {
            console.log('エラーが発生しました', err);
        }
    }

    if (complete) {
      return (
        <main className="flex flex-col items-center justify-center bg-gray-50 px-4 h-[calc(100vh-4rem)] overflow-hidden">
          <h2 className="text-xl font-bold mb-4">
            {t('contact.completeTitle')}
          </h2>
          <p className="mb-2">
            {t('contact.completeMessage', { id: reportId, email: returnedEmail })}
          </p>
        </main>
      );
    }
    return (
        <main className="flex items-center justify-center bg-gray-50 px-4 h-[calc(100vh-4rem)] overflow-hidden">
            <form
            className="w-full max-w-md space-y-6 bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-500"
            onClick={handleSubmit}
            >
                <h1 className="text-2xl font-bold text-center mb-8">
                    LOST<span className="text-blue-600">FOUND</span> {t('contact.name')}
                </h1>
                <textarea
                        placeholder={t('contact.placeHold')}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className='border-2 rounded input input-bordered w-full border-gray-300 p-2 min-h-[120px] resize-vertical'
                        />
                <label className="block space-y-2">
                    <span className="text-sm font-medium text-gray-700">{t('login.email')}</span>
                    <input
                        type="email"
                        placeholder={t('contact.email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-2 rounded input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                </label>
                <label className="block space-y-2">
                    <span className="text-sm font-medium text-gray-700">{t('contact.emailCom')}</span>
                    <input
                        type="email"
                        placeholder={t('contact.emailCom')}
                        value={emailCom}
                        onChange={(e) => setEmailCom(e.target.value)}
                        className="border-2 rounded input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                </label>
                <button
                    type="submit"
                    className="w-full py-2 rounded-md bg-blue-500 hover:bg-blue-700 text-white font-semibold shadow-sm transition-colors"
                    >
                    {t('contact.submit')}
                </button>
            </form>
        </main>
    )
}

export default Contact
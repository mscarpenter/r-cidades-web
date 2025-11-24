// Arquivo: src/pages/CriarBancoDeMateriais.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../config/api';
import { Input, Button, Card, Toast } from '../components';
import './CriarBancoDeMateriais.css';

function CriarBancoDeMateriais() {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const [formData, setFormData] = useState({
        nome: '',
        endereco: '',
        telefone: '',
        latitude: '',
        longitude: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/bancos-materiais', formData, token);

            setToast({ type: 'success', message: 'Banco de materiais cadastrado com sucesso!' });

            setTimeout(() => {
                navigate('/bancos-materiais');
            }, 2000);
        } catch (error) {
            console.error('Erro ao cadastrar banco:', error);
            setToast({
                type: 'error',
                message: error.message || 'Erro ao cadastrar banco de materiais.'
            });
            setLoading(false);
        }
    };

    return (
        <div className="criar-banco-container">
            <h2>Cadastrar Novo Banco de Materiais</h2>
            <p className="subtitle">Registre um ponto físico de coleta e distribuição de materiais.</p>

            <Card>
                <form onSubmit={handleSubmit} className="criar-banco-form">
                    <Input
                        label="Nome do Banco"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        placeholder="Ex: Banco de Materiais - Centro Comunitário"
                    />

                    <Input
                        label="Endereço Completo"
                        name="endereco"
                        value={formData.endereco}
                        onChange={handleChange}
                        required
                        placeholder="Rua, Número, Bairro, Cidade - UF"
                    />

                    <Input
                        label="Telefone de Contato"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleChange}
                        placeholder="(00) 0000-0000"
                    />

                    <div className="form-row">
                        <Input
                            label="Latitude (Opcional)"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            placeholder="-23.550520"
                        />

                        <Input
                            label="Longitude (Opcional)"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            placeholder="-46.633308"
                        />
                    </div>

                    <div className="form-actions">
                        <Button type="button" variant="secondary" onClick={() => navigate('/bancos-materiais')}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Cadastrando...' : 'Cadastrar Banco'}
                        </Button>
                    </div>
                </form>
            </Card>

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

export default CriarBancoDeMateriais;

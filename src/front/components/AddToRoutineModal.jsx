import { useState, useEffect } from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';

export default function AddToRoutineModal({ show, onClose, exerciseId, exerciseName }) {
  const { store } = useGlobalReducer();
  const [userRoutines, setUserRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState('10');
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (show && store.token) {
      fetchUserRoutines();
    } else {
      setSelectedRoutine('');
      setMessage('');
    }
  }, [show]);

  const fetchUserRoutines = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/my-routines`, {
        headers: { Authorization: `Bearer ${store.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserRoutines(Array.isArray(data) ? data : []);
      } else {
        setUserRoutines([]);
        if (res.status === 401) {
          setMessage('Sesión expirada. Inicia sesión nuevamente.');
        } else {
          setMessage('Error al cargar rutinas');
        }
      }
    } catch (err) {
      console.error(err);
      setUserRoutines([]);
      setMessage('Error de conexión');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRoutine) return;
    setAdding(true);
    setMessage('');
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/routines/${selectedRoutine}/exercises`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${store.token}`
        },
        body: JSON.stringify({
          exercise_id: exerciseId,
          sets,
          reps
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || 'Error al agregar');
      }
      setMessage('✅ Ejercicio agregado');
      setTimeout(() => {
        onClose(true);
      }, 1000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setAdding(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Agregar "{exerciseName}" a rutina</h5>
            <button type="button" className="btn-close" onClick={() => onClose()}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {message && (
                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
                  {message}
                </div>
              )}
              <div className="mb-3">
                <label className="form-label">Selecciona una rutina</label>
                <select
                  className="form-select"
                  value={selectedRoutine}
                  onChange={(e) => setSelectedRoutine(e.target.value)}
                  required
                  disabled={userRoutines.length === 0}
                >
                  <option value="">-- Elige --</option>
                  {userRoutines.map(r => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
                {userRoutines.length === 0 && (
                  <small className="text-muted">No tienes rutinas creadas. Crea una primero.</small>
                )}
              </div>
              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label">Series</label>
                  <input
                    type="number"
                    className="form-control"
                    value={sets}
                    onChange={(e) => setSets(parseInt(e.target.value) || 1)}
                    min="1"
                    required
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label">Repeticiones</label>
                  <input
                    type="text"
                    className="form-control"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder="ej: 10-12"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => onClose()}>Cancelar</button>
              <button type="submit" className="btn btn-dark" disabled={adding || userRoutines.length === 0}>
                {adding ? 'Agregando...' : 'Agregar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
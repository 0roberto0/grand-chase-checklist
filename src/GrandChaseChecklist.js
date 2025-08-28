import React, { useEffect } from 'react';

// Dados estáticos
const characters = [
  { name: 'Elesis', img: 'https://vignette.wikia.nocookie.net/grandchase/images/7/74/Ui_character_gc_classic_Elesis_1.png/revision/latest/scale-to-width-down/200?cb=20210731182435&path-prefix=pt-br' },
  { name: 'Lire', img: 'https://vignette.wikia.nocookie.net/grandchase/images/5/53/Ui_character_gc_classic_Lire_1.png/revision/latest/scale-to-width-down/200?cb=20210731182532&path-prefix=pt-br' }
];

const users = ['Roberto', 'Luiz'];

const weeklyMissions = ['Fornalha Infernal', 'Altar da Ruína', 'Torre das Ilusões'];
const dailyMissions = [
  { name: 'Covil de Berkas', count: 1 },
  { name: 'Torre da Extinção', count: 3 },
  { name: 'Terra do Julgamento', count: 1 }
];
const biweeklyMissions = [
  { name: 'Vazio 1 (Invasão)', count: 2 },
  { name: 'Vazio 2 (Contaminação)', count: 2 },
  { name: 'Vazio 3 (Pesadelo)', count: 2 }
];

// ATENÇÃO: Nunca exponha sua API KEY em código público!
const BIN_ID = '68afdc0bae596e708fd9ad89';
const API_KEY = '$2a$10$kKqs5FujefN/Q/jhiFmmAeJ0BySXQzjNF/qC2ewszlywZ4q3yUgFK';

// Componente estrela acessível
const Star = ({ active }) => (
  <span
    style={{
      color: active ? 'gold' : 'lightgray',
      cursor: 'pointer',
      WebkitTextStroke: active ? '1px #333' : '1px transparent'
    }}
    aria-hidden="true"
  >
    {active ? '★' : '☆'}
  </span>
);

const MissionBlock = ({ title, count, user, charName, state, toggleStar }) => {
  const missionKey = title.replace(/^.*–\s*/, '').replace(/\s*\(.*/, '');

  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{title}</div>
      <div style={{ display: 'flex', gap: '5px' }}>
        {Array.from({ length: count }, (_, i) => i + 1).map(v => (
          <button
            key={`${charName}_${missionKey}_${v}`}
            onClick={() => toggleStar(charName, missionKey, v)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer'
            }}
            aria-label={`Marcar missão ${title} ${v}`}
          >
            <Star active={state[user]?.[charName]?.[missionKey] >= v} />
          </button>
        ))}
      </div>
    </div>
  );
};

const GrandChaseChecklist = () => {
  const [user, setUser] = React.useState(users[0]);
  const [state, setState] = React.useState({});
  const [pendingState, setPendingState] = React.useState({});
  const [lastReset, setLastReset] = React.useState(null);
  const [error, setError] = React.useState("");

  const fetchState = async () => {
    try {
      const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: { 'X-Master-Key': API_KEY }
      });
      const data = await res.json();
      const init = data.record || {};
      users.forEach(u => { if (!init[u]) init[u] = {}; });
      if (!init._lastReset) init._lastReset = null;
      setState(init);
      setPendingState(init);
      setLastReset(init._lastReset);
      setError("");
    } catch (err) {
      setError("Erro ao buscar progresso do servidor.");
      const init = {};
      users.forEach(u => { init[u] = {}; });
      init._lastReset = null;
      setState(init);
      setPendingState(init);
      setLastReset(null);
    }
  };

  useEffect(() => { fetchState(); }, []);

  const saveStateToBin = async (nextState) => {
    try {
      await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Master-Key': API_KEY },
        body: JSON.stringify(nextState)
      });
      setError("");
    } catch (err) {
      setError("Erro ao salvar progresso!");
      console.error('Erro ao salvar estado:', err);
    }
  };

  const toggleStar = (charName, mission, value) => {
    setPendingState(prev => {
      const nextCharState = prev[user]?.[charName] ?? {};
      return {
        ...prev,
        [user]: { ...prev[user], [charName]: { ...nextCharState, [mission]: value } },
        _lastReset: prev._lastReset
      };
    });
  };

  const commitChanges = () => {
    setState(pendingState);
    saveStateToBin(pendingState);
  };

  const resetUser = () => {
    if (window.confirm(`Resetar progresso de ${user}?`)) {
      setPendingState(prev => {
        const next = { ...prev, [user]: {}, _lastReset: prev._lastReset };
        return next;
      });
    }
  };

  useEffect(() => {
    const checkReset = () => {
      const now = new Date();
      const brOffset = -3 * 60;
      const brTime = new Date(now.getTime() + (now.getTimezoneOffset() - brOffset) * 60000);
      const brHours = brTime.getHours();
      const brDay = brTime.getDay();
      const lastResetTime = lastReset ? new Date(lastReset) : null;
      const needsDailyReset = !lastResetTime || (brTime > lastResetTime && brHours === 3);
      if (needsDailyReset) {
        setState(prev => {
          const next = { ...prev };
          users.forEach(u => { next[u] = {}; });
          next._lastReset = brTime.toISOString();
          saveStateToBin(next);
          setPendingState(next);
          setLastReset(brTime.toISOString());
          return next;
        });
      }
    };
    const interval = setInterval(checkReset, 60000);
    return () => clearInterval(interval);
  }, [lastReset]);

  const cardStyle = { border: '1px solid #333', borderRadius: '8px', padding: '10px', width: '220px', backgroundColor: '#ffffff', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' };
  const characterNameStyle = { fontWeight: 'bold', fontSize: '18px', marginBottom: '5px' };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '28px' }}>Grand Chase – Checklist de Missões</h1>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
        <select
          style={{ padding: '5px', width: '200px', borderRadius: '4px', border: '1px solid #333', textAlign: 'center' }}
          value={user}
          onChange={e => setUser(e.target.value)}
        >
          {users.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <button style={{ padding: '5px 10px', border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff' }} onClick={resetUser}>
          Resetar tudo
        </button>
        <button style={{ padding: '5px 10px', border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff' }} onClick={commitChanges}>
          Salvar Alterações
        </button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {characters.map(ch => (
          <div key={ch.name} style={cardStyle}>
            <img src={ch.img} alt={ch.name} style={{ width: '100%', borderRadius: '4px' }}
              onError={(e) => { e.target.onerror = null; e.target.src = `https://via.placeholder.com/200x200.png?text=${encodeURIComponent(ch.name)}`; }}
            />
            <div style={{ marginTop: '10px' }}>
              <div style={characterNameStyle}>{ch.name}</div>
              {weeklyMissions.map(m => (
                <MissionBlock
                  key={`${ch.name}_Semanais_${m}`}
                  title={`Semanais – ${m}`}
                  count={5}
                  user={user}
                  charName={ch.name}
                  state={pendingState}
                  toggleStar={toggleStar}
                />
              ))}
              {dailyMissions.map(dm => (
                <MissionBlock
                  key={`${ch.name}_Diaria_${dm.name}`}
                  title={`Diária – ${dm.name} (${dm.count}x/dia)`}
                  count={dm.count}
                  user={user}
                  charName={ch.name}
                  state={pendingState}
                  toggleStar={toggleStar}
                />
              ))}
              {biweeklyMissions.map(bm => (
                <MissionBlock
                  key={`${ch.name}_BiSemanal_${bm.name}`}
                  title={`Semanais (2x/semana) – ${bm.name}`}
                  count={bm.count}
                  user={user}
                  charName={ch.name}
                  state={pendingState}
                  toggleStar={toggleStar}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrandChaseChecklist;
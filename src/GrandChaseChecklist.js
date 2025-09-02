import React, { useEffect } from 'react';

const characters = [
  { name: 'Elesis', img: 'https://images.steamusercontent.com/ugc/1684896812223190011/CA5960EC387C31970A90A43811EE9EC644CD4D84/' },
  { name: 'Lire', img: 'https://images.steamusercontent.com/ugc/1684896812223193215/5B52138D885CC0CD959EAFB21E104B646C1F914A/' },
  { name: 'Arme', img: 'https://images.steamusercontent.com/ugc/1684896812223193471/FCF7CD607DCD002187B76DE59E49045B4E7941C3/' },
  { name: 'Lass', img: 'https://images.steamusercontent.com/ugc/1684896812223170005/48C0549099A6EA5B2C69C46DD4A2B529591AF153/' },
  { name: 'Ryan', img: 'https://images.steamusercontent.com/ugc/1684896812223170770/299F9B1C003A1F489A3258A03B10F669E0E3509C/' },
  { name: 'Ronan', img: 'https://images.steamusercontent.com/ugc/1617345054791666060/52C59EE34BE44315A1381DF7CA352069CD4EBA26/' },
  { name: 'Amy', img: 'https://images.steamusercontent.com/ugc/1734440460415027775/4035D8833CB5AE5D5766D0AB09DA295F64A9599B/' },
  { name: 'Jin', img: 'https://images.steamusercontent.com/ugc/1753582113769273520/C114DC4F3D224F22D2B36D88017059542F3F85CA/' },
  { name: 'Sieghart', img: 'https://images.steamusercontent.com/ugc/1800871909723324389/F08584310FB5405DB6FC2EA9514FCD8D1F93BA68/' },
  { name: 'Mari', img: 'https://images.steamusercontent.com/ugc/1839155307853187740/D2CC1772DDC26C1A1677891F8931D267D6D58B66/' },
  { name: 'Dio', img: 'https://images.steamusercontent.com/ugc/1839156580936604614/23595679181D5E5080B66D35D4F421A1144BC5A2/' },
  { name: 'Zero', img: 'https://images.steamusercontent.com/ugc/1822272699457309822/178617B01BC939A0202A310E4653D4CF83D813A9/' },
  { name: 'Rey', img: 'https://images.steamusercontent.com/ugc/1822272699457310168/CA07908E0B668533BBB40CEE1302E966F4DFECC7/' },
  { name: 'Lupus', img: 'https://images.steamusercontent.com/ugc/1822272699457310622/ECD6E11EC54393A9557C330515A533BFC5D79556/' },
  { name: 'Lin', img: 'https://images.steamusercontent.com/ugc/1822274875862201643/AE82ED82D1351B62A12F960D0531F354CA607E9B/' },
  { name: 'Azin', img: 'https://images.steamusercontent.com/ugc/1816647004878345120/0F11B650A9F36C1CAFE02115B82EC3190C9EB4FC/' },
  { name: 'Holly', img: 'https://images.steamusercontent.com/ugc/1818900707402581946/B61469EAB81F13D1165A538AE9D120369D78C972/' },
  { name: 'Edel', img: 'https://images.steamusercontent.com/ugc/1818902697311288696/3D9749B856F00AF9105926BB944B87EAB66D2216/' },
  { name: 'Veigas', img: 'https://images.steamusercontent.com/ugc/1817778245787888332/05F0E73F1E218C05AE1E29B69BF7B4E841BEFF54/' },
  { name: 'Decanee', img: 'https://images.steamusercontent.com/ugc/1999069425670398163/C9FBF2BA35ED0101D67F583C87AA5E90C5E19615/' },
  { name: 'Ai', img: 'https://images.steamusercontent.com/ugc/2459607510989366388/B22149FCEC5829660E8ADF22CDBA9B47146C73BB/' },
  { name: 'Kallia', img: 'https://images.steamusercontent.com/ugc/2459607510989367098/C26ADD733328A51767AB59EDD549CF0FB2040174/' },
  { name: 'Uno', img: 'https://images.steamusercontent.com/ugc/1817778245787888798/150CEBA9016C2391E484FF53E641202DDFD65B80/' }
];

const users = ['Roberto', 'Luiz'];

const weeklyMissions = [
  { name: 'Fornalha Infernal', count: 5 },
  { name: 'Altar da Ruína', count: 5 },
  { name: 'Torre das Ilusões', count: 5 }
];

const biweeklyMissions = [
  { name: 'Vazio 1 (Invasão)', count: 2 },
  { name: 'Vazio 2 (Contaminação)', count: 2 },
  { name: 'Vazio 3 (Pesadelo)', count: 2 }
];

const dailyMissions = [
  { name: 'Covil de Berkas', count: 1 },
  { name: 'Torre da Extinção', count: 3 },
  { name: 'Terra do Julgamento', count: 1 }
];

const BIN_ID = '68afdc0bae596e708fd9ad89';
const API_KEY = '$2a$10$kKqs5FujefN/Q/jhiFmmAeJ0BySXQzjNF/qC2ewszlywZ4q3yUgFK';

let cachedState = null;
let lastFetchedAt = null;

const Star = ({ active }) => (
  <span style={{ color: active ? 'gold' : '#aaa', cursor: 'pointer', fontSize: '22px', WebkitTextStroke: active ? '1px #333' : '0.5px #666' }} aria-hidden="true">
    ★
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
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
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

  const fetchState = async (force = false) => {
    if (cachedState && !force) {
      console.log("⚡ Usando cache");
      return cachedState;
    }

    try {
      console.log("🌐 Buscando do JSONBin...");
      const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, { headers: { 'X-Master-Key': API_KEY } });
      const data = await res.json();
      const init = data.record || {};
      users.forEach(u => { if (!init[u]) init[u] = {}; });
      if (!init._lastReset) init._lastReset = null;
      if (!init.lastDailyReset) init.lastDailyReset = null;
      if (!init.lastWeeklyReset) init.lastWeeklyReset = null;

      cachedState = init;
      lastFetchedAt = Date.now();

      setState(init);
      setPendingState(init);
      setLastReset(init._lastReset);
      setError("");
      return init;
    } catch (err) {
      setError("Erro ao buscar progresso do servidor.");
      const init = {};
      users.forEach(u => { init[u] = {}; });
      init._lastReset = null;
      setState(init);
      setPendingState(init);
      setLastReset(null);
      return init;
    }
  };

  useEffect(() => { fetchState(); }, []);

  const saveStateToBin = async (nextState) => {
    try {
      cachedState = nextState;
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
      const newValue = (nextCharState[mission] || 0) === value ? value - 1 : value;
      return { ...prev, [user]: { ...prev[user], [charName]: { ...nextCharState, [mission]: newValue } }, _lastReset: prev._lastReset };
    });
  };

  const commitChanges = () => {
    setState(pendingState);
    saveStateToBin(pendingState);
  };

  const resetUser = () => {
    if (window.confirm(`Resetar progresso de ${user}?`)) {
      setPendingState(prev => ({ ...prev, [user]: {}, _lastReset: prev._lastReset }));
    }
  };

  const performResetIfNeeded = (currentState) => {
    const now = new Date();
    const lastDailyReset = new Date(currentState.lastDailyReset || 0);
    const lastWeeklyReset = new Date(currentState.lastWeeklyReset || 0);
  
    const todayReset = new Date(now);
    todayReset.setHours(3, 0, 0, 0);
  
    const thisWeekReset = new Date(todayReset);
    thisWeekReset.setDate(todayReset.getDate() + ((3 - todayReset.getDay() + 7) % 7));
  
    let nextState = { ...currentState };
    let changed = false;
  
    // Reset diário
    if (now >= todayReset && lastDailyReset < todayReset) {
      users.forEach(u => Object.keys(nextState[u] || {}).forEach(charName =>
        dailyMissions.forEach(m => nextState[u][charName][m.name] = 0)
      ));
      nextState.lastDailyReset = now.toISOString();
      changed = true;
    }
  
    // Reset semanal
    if (now >= thisWeekReset && lastWeeklyReset < thisWeekReset) {
      users.forEach(u => Object.keys(nextState[u] || {}).forEach(charName =>
        [...weeklyMissions, ...biweeklyMissions].forEach(m => nextState[u][charName][m.name] = 0)
      ));
      nextState.lastWeeklyReset = now.toISOString();
      changed = true;
    }
  
    if (changed) {
      setState(nextState);
      setPendingState(nextState);
      saveStateToBin(nextState);
    }
  
    return nextState; // opcional, se quiser reutilizar
  };

  useEffect(() => {
    const init = async () => {
      const initState = await fetchState();

      // depois que state estiver carregado do servidor, checa reset
      performResetIfNeeded(initState);
    };
  
    init();
  }, []);

  const cardStyle = { border: '1px solid #333', borderRadius: '8px', padding: '10px', width: '220px', backgroundColor: '#ffffff', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' };
  const characterNameStyle = { fontWeight: 'bold', fontSize: '18px', marginBottom: '5px' };

  const CollapsibleSection = ({ title, children }) => {
    const [open, setOpen] = React.useState(true);
    return (
      <div style={{ marginBottom: '10px' }}>
        <div
          onClick={() => setOpen(!open)}
          style={{
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#ddd',
            padding: '5px 10px',
            borderRadius: '4px'
          }}
        >
          <span>{title}</span>
          <span style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
        </div>
        {open && <div style={{ padding: '10px' }}>{children}</div>}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '28px' }}>Grand Chase – Checklist de Missões</h1>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
        <select style={{ padding: '5px', width: '200px', borderRadius: '4px', border: '1px solid #333', textAlign: 'center' }} value={user} onChange={e => setUser(e.target.value)}>
          {users.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <button style={{ padding: '5px 10px', border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff' }} onClick={resetUser}>Resetar tudo</button>
        <button style={{ padding: '5px 10px', border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fff' }} onClick={commitChanges}>Salvar Alterações</button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {characters.map(ch => (
          <div key={ch.name} style={cardStyle}>
            <img
              src={ch.img}
              alt={ch.name}
              style={{ width: '100%', borderRadius: '4px' }}
              onError={(e) => { e.target.onerror = null; e.target.src = `https://via.placeholder.com/200x200.png?text=${encodeURIComponent(ch.name)}`; }}
            />
            <div style={{ marginTop: '10px' }}>
              <div style={characterNameStyle}>{ch.name}</div>

              <CollapsibleSection title="SEMANAIS">
                {weeklyMissions.map(m => (
                  <MissionBlock
                    key={`${ch.name}_Semanais_${m.name}`}
                    title={m.name}
                    count={m.count}
                    user={user}
                    charName={ch.name}
                    state={pendingState}
                    toggleStar={toggleStar}
                  />
                ))}
                {biweeklyMissions.map(bm => (
                  <MissionBlock
                    key={`${ch.name}_BiSemanal_${bm.name}`}
                    title={bm.name}
                    count={bm.count}
                    user={user}
                    charName={ch.name}
                    state={pendingState}
                    toggleStar={toggleStar}
                  />
                ))}
              </CollapsibleSection>

              <CollapsibleSection title="DIÁRIAS">
                {dailyMissions.map(dm => (
                  <MissionBlock
                    key={`${ch.name}_Diaria_${dm.name}`}
                    title={dm.name}
                    count={dm.count}
                    user={user}
                    charName={ch.name}
                    state={pendingState}
                    toggleStar={toggleStar}
                  />
                ))}
              </CollapsibleSection>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrandChaseChecklist;

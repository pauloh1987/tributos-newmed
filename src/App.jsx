import { useState, useEffect } from "react";

function App() {
  const [aba, setAba] = useState("compra");
  const [adminMode, setAdminMode] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const ufs = { AC:12,AL:12,AP:12,AM:12,BA:12,CE:12,DF:12,
    ES:12,GO:12,MA:12,MT:12,MS:12,MG:7,PA:12,
    PB:12,PE:0,PR:12,PI:12,RJ:7,RN:12,RS:7,
    RO:12,RR:12,SC:7,SP:7,SE:12,TO:12 };

  const [ufOrigem, setUfOrigem] = useState("SP");
  const [valorItem, setValorItem] = useState(0);
  const [ipi, setIpi] = useState(0);
  const [icms, setIcms] = useState(ufs["SP"]);
  const [frete, setFrete] = useState(0);
  const [despesas, setDespesas] = useState(0);
  const [valorVenda, setValorVenda] = useState(0);
  const [categoria, setCategoria] = useState("venda");
  const [aliquotasSimples, setAliquotasSimples] = useState({
    venda:0.1169, locacao:0.1725, servico:0.1725 });

  const aliquotas = {"4":0.1362,"7":0.1105,"12":0.0637};
  useEffect(() => setIcms(ufs[ufOrigem]), [ufOrigem]);

  const getAliquotaAplicavel = () => aliquotas[(ufs[ufOrigem]||12).toString()]||0;

  const calcularCompra = () => {
    const icmsReais = valorItem * (icms/100);
    const ipiReais = valorItem * (ipi/100);
    const base = valorItem - icmsReais + ipiReais + frete + despesas;
    const novaBase = base / 0.795;
    const valorFronteira = novaBase * getAliquotaAplicavel();
    return { valorFronteira, total: valorItem + valorFronteira };
  };

  const calcularVenda = () => {
    const aliq = aliquotasSimples[categoria];
    const valorSimples = valorVenda * aliq;
    return { valorSimples, valorFinal: valorVenda - valorSimples, aliq };
  };

  const handleLogin = () => {
    if (usuario === "Lucas" && senha === "lucas1987") {
      setAdminMode(true);
      setLoginOpen(false);
    } else alert("Usuário ou senha incorretos.");
  };

  const { valorFronteira, total } = calcularCompra();
  const { valorSimples, valorFinal, aliq } = calcularVenda();

  return (
    <div className="min-h-screen bg-cyan-50 text-slate-900 font-sans p-5">
      <div className="text-center mb-6">
        <img src="/logo-newmed.jpeg" alt="Logo Newmed" className="mx-auto max-h-20" />
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <button onClick={() => setAba("compra")} className="btn">Compra</button>
        <button onClick={() => setAba("venda")} className="btn">Venda</button>
        <button onClick={() => adminMode ? setAdminMode(false) : setLoginOpen(true)} className="btn">
          {adminMode ? "Sair do admin" : "Entrar admin"}
        </button>
      </div>

      {loginOpen && (
        <div className="flex flex-col items-center gap-3 mb-6">
          <input placeholder="Usuário" value={usuario} onChange={e=>setUsuario(e.target.value)} className="input" />
          <input placeholder="Senha" type="password" value={senha} onChange={e=>setSenha(e.target.value)} className="input" />
          <button onClick={handleLogin} className="btn">Entrar</button>
        </div>
      )}

      {aba === "compra" && (
        <div className="bg-white shadow border border-gray-300 p-6 rounded-lg max-w-xl mx-auto flex flex-col gap-4">
          <select value={ufOrigem} onChange={e => setUfOrigem(e.target.value)} className="select">
            {Object.keys(ufs).map(uf => <option key={uf} value={uf}>{uf}</option>)}
          </select>
          <input type="number" placeholder="Valor do item" onChange={e => setValorItem(+e.target.value)} className="input" />
          <input type="number" placeholder="IPI (%)" onChange={e => setIpi(+e.target.value)} className="input" />
          <input type="number" placeholder="ICMS (%)" value={icms} readOnly className="input" />
          <input type="number" placeholder="Frete (R$)" onChange={e => setFrete(+e.target.value)} className="input" />
          <input type="number" placeholder="Outras despesas (R$)" onChange={e => setDespesas(+e.target.value)} className="input" />
          <p className="font-semibold text-blue-800">Valor da Fronteira: R$ {valorFronteira.toFixed(2)}</p>
          <p className="font-semibold text-blue-800">Valor Total: R$ {total.toFixed(2)}</p>
        </div>
      )}

      {aba === "venda" && (
        <div className="bg-white shadow border border-gray-300 p-6 rounded-lg max-w-xl mx-auto flex flex-col gap-4">
          <select value={categoria} onChange={e => setCategoria(e.target.value)} className="select">
            <option value="venda">Venda</option>
            <option value="locacao">Locação</option>
            <option value="servico">Serviço</option>
          </select>
          <input type="number" placeholder="Valor da venda (R$)" onChange={e => setValorVenda(+e.target.value)} className="input" />
          {adminMode && (
            <>
              <input type="number" step="0.0001" placeholder="Alíquota venda"
                onChange={e => setAliquotasSimples({ ...aliquotasSimples, venda: +e.target.value })}
                className="input" />
              <input type="number" step="0.0001" placeholder="Alíquota locação"
                onChange={e => setAliquotasSimples({ ...aliquotasSimples, locacao: +e.target.value })}
                className="input" />
              <input type="number" step="0.0001" placeholder="Alíquota serviço"
                onChange={e => setAliquotasSimples({ ...aliquotasSimples, servico: +e.target.value })}
                className="input" />
            </>
          )}
          <p className="font-semibold text-blue-800">Alíquota: {(aliq * 100).toFixed(2)}%</p>
          <p className="font-semibold text-blue-800">Valor do Simples: R$ {valorSimples.toFixed(2)}</p>
          <p className="font-semibold text-blue-800">Valor Final: R$ {valorFinal.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default App;

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
  const [percentualVenda, setPercentualVenda] = useState(30); // Nova funcionalidade
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
    const custoTotal = valorItem + valorFronteira;
    const valorVendaSugerido = custoTotal * (1 + percentualVenda/100);
    return { valorFronteira, total: custoTotal, valorVendaSugerido };
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
      setUsuario("");
      setSenha("");
    } else alert("Usuário ou senha incorretos.");
  };

  const { valorFronteira, total, valorVendaSugerido } = calcularCompra();
  const { valorSimples, valorFinal, aliq } = calcularVenda();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 font-sans">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-blue-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            <img 
              src="/logo-newmed.jpeg" 
              alt="Logo Newmed" 
              className="h-12 w-auto object-contain"
              onError={(e) => {
                // Fallback caso a imagem não carregue
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center hidden">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Calculadora Fiscal Newmed</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button 
            onClick={() => setAba("compra")} 
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              aba === "compra" 
                ? "bg-blue-600 text-white shadow-lg transform scale-105" 
                : "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50"
            }`}
          >
            📦 Compra
          </button>
          <button 
            onClick={() => setAba("venda")} 
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              aba === "venda" 
                ? "bg-green-600 text-white shadow-lg transform scale-105" 
                : "bg-white text-green-600 border-2 border-green-600 hover:bg-green-50"
            }`}
          >
            💰 Venda
          </button>
          <button 
            onClick={() => adminMode ? setAdminMode(false) : setLoginOpen(true)} 
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              adminMode 
                ? "bg-red-600 text-white shadow-lg" 
                : "bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50"
            }`}
          >
            {adminMode ? "🚪 Sair Admin" : "🔐 Admin"}
          </button>
        </div>

        {/* Admin Login */}
        {loginOpen && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-md mx-auto border border-purple-200">
            <h3 className="text-lg font-semibold text-center mb-4 text-purple-800">Acesso Administrativo</h3>
            <div className="space-y-4">
              <input 
                placeholder="👤 Usuário" 
                value={usuario} 
                onChange={e=>setUsuario(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" 
              />
              <input 
                placeholder="🔒 Senha" 
                type="password" 
                value={senha} 
                onChange={e=>setSenha(e.target.value)} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all" 
              />
              <button 
                onClick={handleLogin} 
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Entrar
              </button>
            </div>
          </div>
        )}

        {/* Compra Tab */}
        {aba === "compra" && (
          <div className="bg-white rounded-xl shadow-lg border border-blue-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                📦 Cálculo de Compra
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Estado de Origem</label>
                    <select 
                      value={ufOrigem} 
                      onChange={e => setUfOrigem(e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                      {Object.keys(ufs).map(uf => <option key={uf} value={uf}>{uf}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Valor do Item (R$)</label>
                    <input 
                      type="number" 
                      placeholder="0,00" 
                      onChange={e => setValorItem(+e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">IPI (%)</label>
                    <input 
                      type="number" 
                      placeholder="0" 
                      onChange={e => setIpi(+e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">ICMS (%) - Automático</label>
                    <input 
                      type="number" 
                      value={icms} 
                      readOnly 
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Frete (R$)</label>  
                    <input 
                      type="number" 
                      placeholder="0,00" 
                      onChange={e => setFrete(+e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Outras Despesas (R$)</label>
                    <input 
                      type="number" 
                      placeholder="0,00" 
                      onChange={e => setDespesas(+e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Margem de Venda (%)</label>
                    <input 
                      type="number" 
                      value={percentualVenda}
                      onChange={e => setPercentualVenda(+e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" 
                    />
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-3">📊 Resultados do Cálculo</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-blue-200">
                        <span className="text-gray-700">Valor da Fronteira:</span>
                        <span className="font-bold text-blue-700">R$ {valorFronteira.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-blue-200">
                        <span className="text-gray-700">Custo Total:</span>
                        <span className="font-bold text-blue-700">R$ {total.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 bg-green-100 px-3 rounded-lg border border-green-300">
                        <span className="text-gray-700">💡 Valor de Venda Sugerido:</span>
                        <span className="font-bold text-green-700 text-lg">R$ {valorVendaSugerido.toFixed(2)}</span>
                      </div>
                      
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <strong>Margem aplicada:</strong> {percentualVenda}% sobre o custo total
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Venda Tab */}
        {aba === "venda" && (
          <div className="bg-white rounded-xl shadow-lg border border-green-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                💰 Cálculo de Venda - Simples Nacional
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Categoria</label>
                    <select 
                      value={categoria} 
                      onChange={e => setCategoria(e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="venda">🛒 Venda</option>
                      <option value="locacao">🏠 Locação</option>
                      <option value="servico">🔧 Serviço</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Valor da Venda (R$)</label>
                    <input 
                      type="number" 
                      placeholder="0,00" 
                      onChange={e => setValorVenda(+e.target.value)} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" 
                    />
                  </div>

                  {adminMode && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-3">⚙️ Configurações Admin</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Alíquota Venda</label>
                          <input 
                            type="number" 
                            step="0.0001" 
                            value={aliquotasSimples.venda}
                            onChange={e => setAliquotasSimples({ ...aliquotasSimples, venda: +e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Alíquota Locação</label>
                          <input 
                            type="number" 
                            step="0.0001" 
                            value={aliquotasSimples.locacao}
                            onChange={e => setAliquotasSimples({ ...aliquotasSimples, locacao: +e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none text-sm" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Alíquota Serviço</label>
                          <input 
                            type="number" 
                            step="0.0001" 
                            value={aliquotasSimples.servico}
                            onChange={e => setAliquotasSimples({ ...aliquotasSimples, servico: +e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-transparent outline-none text-sm" 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Results */}
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-3">📊 Resultados da Venda</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-green-200">
                        <span className="text-gray-700">Alíquota Aplicada:</span>
                        <span className="font-bold text-green-700">{(aliq * 100).toFixed(2)}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-green-200">
                        <span className="text-gray-700">Valor do Simples:</span>
                        <span className="font-bold text-red-600">- R$ {valorSimples.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 bg-green-100 px-3 rounded-lg border border-green-300">
                        <span className="text-gray-700">💰 Valor Final Líquido:</span>
                        <span className="font-bold text-green-700 text-lg">R$ {valorFinal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-6 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-300">© 2024 Newmed - Calculadora Fiscal</p>
        </div>
      </div>
    </div>
  );
}

export default App;
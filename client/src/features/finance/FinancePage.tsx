import { useState } from 'react';
import { motion } from 'framer-motion';

export default function FinancePage() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(240);

  const monthlyRate = rate / 12 / 100;
  const emi = monthlyRate > 0
    ? (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / (Math.pow(1 + monthlyRate, tenure) - 1)
    : principal / tenure;
  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - principal;

  const formatNPR = (n: number) => `Rs. ${Math.round(n).toLocaleString('en-IN')}`;

  const principalPercent = (principal / totalAmount) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container-custom py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Finance & EMI Calculator</h1>
          <p className="text-gray-500 mt-2">Plan your property investment with our financial tools</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Calculator */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="card p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">EMI Calculator</h2>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Loan Amount</label>
                  <span className="text-sm font-semibold text-primary-700">{formatNPR(principal)}</span>
                </div>
                <input type="range" min={500000} max={100000000} step={100000} value={principal} onChange={(e) => setPrincipal(+e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-700" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Rs. 5 Lakh</span><span>Rs. 10 Cr</span></div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Interest Rate (Annual)</label>
                  <span className="text-sm font-semibold text-primary-700">{rate}%</span>
                </div>
                <input type="range" min={5} max={20} step={0.25} value={rate} onChange={(e) => setRate(+e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-700" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5%</span><span>20%</span></div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Loan Tenure</label>
                  <span className="text-sm font-semibold text-primary-700">{Math.floor(tenure/12)} years ({tenure} months)</span>
                </div>
                <input type="range" min={12} max={360} step={12} value={tenure} onChange={(e) => setTenure(+e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-700" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>1 year</span><span>30 years</span></div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly EMI</h2>

            <div className="text-center mb-8">
              <p className="text-4xl font-bold text-primary-700">{formatNPR(emi)}</p>
              <p className="text-sm text-gray-500 mt-1">per month</p>
            </div>

            {/* Visual bar */}
            <div className="mb-6">
              <div className="h-4 rounded-full overflow-hidden bg-gray-100 flex">
                <div className="bg-primary-700 h-full transition-all" style={{ width: `${principalPercent}%` }} />
                <div className="bg-accent h-full transition-all" style={{ width: `${100 - principalPercent}%` }} />
              </div>
              <div className="flex justify-between mt-2">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-primary-700" /><span className="text-xs text-gray-500">Principal</span></div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-accent" /><span className="text-xs text-gray-500">Interest</span></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">Principal Amount</span>
                <span className="text-sm font-semibold text-gray-900">{formatNPR(principal)}</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">Total Interest</span>
                <span className="text-sm font-semibold text-accent-600">{formatNPR(totalInterest)}</span>
              </div>
              <div className="flex justify-between p-4 bg-primary-50 rounded-xl border border-primary-100">
                <span className="text-sm font-medium text-primary-700">Total Amount</span>
                <span className="text-sm font-bold text-primary-700">{formatNPR(totalAmount)}</span>
              </div>
            </div>

            <button className="btn-primary w-full mt-6">Apply for Loan</button>
          </motion.div>
        </div>

        {/* Partner Banks */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Partner Banks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {['Nepal Bank', 'Rastriya Banijya Bank', 'NIC Asia Bank', 'Nabil Bank'].map((bank) => (
              <div key={bank} className="card p-6 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-gray-100 flex items-center justify-center mb-3">
                  <span className="text-xl">🏦</span>
                </div>
                <p className="text-sm font-medium text-gray-700">{bank}</p>
                <p className="text-xs text-gray-400 mt-1">From 8.5% p.a.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

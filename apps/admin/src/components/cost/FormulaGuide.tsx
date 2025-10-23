'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'

export function FormulaGuide() {
    const [isExpanded, setIsExpanded] = useState(false)

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Header - Always Visible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Công thức & Hướng dẫn sử dụng
                    </h3>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
            </button>

            {/* Expandable Content */}
            {isExpanded && (
                <div className="px-6 pb-6 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                    {/* Currency Warning */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                            ⚠️ Lưu ý quan trọng về đơn vị tiền tệ
                        </h4>
                        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc list-inside">
                            <li>
                                <span className="bg-yellow-100 dark:bg-yellow-900/40 px-2 py-0.5 rounded font-mono text-xs">
                                    CNY (¥)
                                </span>{' '}
                                - Dùng cho giá nhập và ship nội địa Trung Quốc
                            </li>
                            <li>
                                <span className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded font-mono text-xs">
                                    VND (₫)
                                </span>{' '}
                                - Dùng cho ship quốc tế, phí xử lý, và kết quả tính toán
                            </li>
                            <li>Kiểm tra kỹ đơn vị trước khi nhập để tránh sai số lớn!</li>
                        </ul>
                    </div>

                    {/* Variable Definitions */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                            Ký hiệu & Định nghĩa
                        </h4>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                                            Ký hiệu
                                        </th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                                            Tên biến
                                        </th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                                            Mô tả
                                        </th>
                                        <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                                            Đơn vị
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <tr className="bg-yellow-50 dark:bg-yellow-900/10">
                                        <td className="px-4 py-2 font-mono text-xs">P_nhập</td>
                                        <td className="px-4 py-2">Import Price</td>
                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                                            Giá nhập từ 1688/xưởng
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="bg-yellow-100 dark:bg-yellow-900/40 px-2 py-0.5 rounded text-xs">
                                                CNY (¥)
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-yellow-50 dark:bg-yellow-900/10">
                                        <td className="px-4 py-2 font-mono text-xs">P_shipTQ</td>
                                        <td className="px-4 py-2">Domestic Shipping</td>
                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                                            Phí ship nội địa TQ
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="bg-yellow-100 dark:bg-yellow-900/40 px-2 py-0.5 rounded text-xs">
                                                CNY (¥)
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-blue-50 dark:bg-blue-900/10">
                                        <td className="px-4 py-2 font-mono text-xs">P_shipVN</td>
                                        <td className="px-4 py-2">International Shipping</td>
                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                                            Phí ship quốc tế (TQ → VN)
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded text-xs">
                                                VND (₫)
                                            </span>
                                        </td>
                                    </tr>
                                    <tr className="bg-blue-50 dark:bg-blue-900/10">
                                        <td className="px-4 py-2 font-mono text-xs">P_xử_lý</td>
                                        <td className="px-4 py-2">Handling Fee</td>
                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                                            Chi phí xử lý/gom hàng/thuế
                                        </td>
                                        <td className="px-4 py-2">
                                            <span className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded text-xs">
                                                VND (₫)
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 font-mono text-xs">T_CNY→VND</td>
                                        <td className="px-4 py-2">Exchange Rate</td>
                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                                            Tỷ giá CNY sang VND
                                        </td>
                                        <td className="px-4 py-2 text-xs">VND/¥</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 font-mono text-xs">SL</td>
                                        <td className="px-4 py-2">Quantity</td>
                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                                            Số lượng sản phẩm trong lô
                                        </td>
                                        <td className="px-4 py-2 text-xs">cái</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 font-mono text-xs">R</td>
                                        <td className="px-4 py-2">Return Rate</td>
                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                                            Tỷ lệ hoàn hàng
                                        </td>
                                        <td className="px-4 py-2 text-xs">0.05 = 5%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 font-mono text-xs">F</td>
                                        <td className="px-4 py-2">Platform Fee</td>
                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400">Phí sàn TMĐT</td>
                                        <td className="px-4 py-2 text-xs">0.20 = 20%</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 font-mono text-xs">G</td>
                                        <td className="px-4 py-2">Profit Margin</td>
                                        <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                                            Biên lợi nhuận mong muốn
                                        </td>
                                        <td className="px-4 py-2 text-xs">0.15 = 15%</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Formula Steps */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                            Các bước tính toán
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                                    1. Giá vốn cơ bản (C₀)
                                </div>
                                <code className="text-xs bg-white dark:bg-gray-800 px-3 py-1.5 rounded block mt-2">
                                    C₀ = [(P_nhập + P_shipTQ) × T_CNY→VND + P_shipVN + P_xử_lý] / SL
                                </code>
                                <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs">
                                    Giá vốn thực tế 1 sản phẩm sau khi nhập về VN
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                                    2. Giá vốn hiệu dụng (C_eff)
                                </div>
                                <code className="text-xs bg-white dark:bg-gray-800 px-3 py-1.5 rounded block mt-2">
                                    C_eff = C₀ / (1 - R)
                                </code>
                                <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs">
                                    Chi phí thực tế khi tính đến tỷ lệ hoàn hàng
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                                    3. Giá bán đề xuất (P)
                                </div>
                                <code className="text-xs bg-white dark:bg-gray-800 px-3 py-1.5 rounded block mt-2">
                                    P = C_eff × (1 + G) / (1 - F)
                                </code>
                                <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs">
                                    Giá bán cần đạt để có lợi nhuận mục tiêu sau khi trừ phí sàn
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                                    4. Lợi nhuận ròng (L)
                                </div>
                                <code className="text-xs bg-white dark:bg-gray-800 px-3 py-1.5 rounded block mt-2">
                                    L = P × (1 - F) - C_eff
                                </code>
                                <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs">
                                    Lợi nhuận thực tế trên mỗi sản phẩm bán được
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                                <div className="font-semibold text-gray-900 dark:text-white mb-1">
                                    5. Giá hòa vốn (P_BE)
                                </div>
                                <code className="text-xs bg-white dark:bg-gray-800 px-3 py-1.5 rounded block mt-2">
                                    P_BE = C_eff / (1 - F)
                                </code>
                                <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs">
                                    Giá tối thiểu để không lỗ (khi G = 0)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Example */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                            📘 Ví dụ tính toán
                        </h4>
                        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            <p>
                                <strong>Input:</strong> P_nhập = 5.2¥, P_shipTQ = 10¥, T_CNY→VND = 3,600, P_shipVN =
                                75,000₫, P_xử_lý = 50,000₫, SL = 50, R = 5%, F = 20%, G = 15%
                            </p>
                            <p className="font-mono text-xs mt-2 bg-white dark:bg-gray-800 p-2 rounded">
                                C₀ = [(5.2 + 10) × 3,600 + 75,000 + 50,000] / 50 = 3,594₫
                                <br />
                                C_eff = 3,594 / 0.95 = 3,783₫
                                <br />
                                P = 3,783 × 1.15 / 0.8 = 5,433₫
                                <br />L = 5,433 × 0.8 - 3,783 = 563₫
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

import React from 'react'

const TableFooter = (itemsPerPage, menuItems, currentPage, setCurrentPage, totalPages) => {
    return (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-700">Showing {menuItems.length} of {totalPages * itemsPerPage} items</p>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 text-sm font-medium rounded-md ${currentPage === 1
                        ? "text-gray-400 bg-white border border-gray-300 cursor-not-allowed"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                >
                    Previous
                </button>
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 text-sm font-medium rounded-md ${currentPage === totalPages
                        ? "text-gray-400 bg-white border border-gray-300 cursor-not-allowed"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                        }`}>
                    Next
                </button>
            </div>
        </div>
    )
}

export default TableFooter
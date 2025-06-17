function NotificationBodyRightDrawer(){
    return(
        <>
             {
                [...Array(2)].map((_, i) => {
                    return <div key={i} className={"grid mt-3 card bg-base-200 rounded-box p-3" + (i < 1 ? " bg-secondary" : "")}>
                            {i % 2 === 0 ? `Stok AC CLEANER  Menipis Segera Lakukan Restock!` : `Berhasil Membeli AIR RADIATOR di Toko Sparepart Jaya`}
                        </div> 
                })
            }
        </>
    )
}

export default NotificationBodyRightDrawer


> pnpm link --global


> pnpm unlink --global

periksa link
> pnpm ls --global --depth=0


  "./tailwind.config.cjs",
            "./tailwind.config.mjs",
            "./tailwind.config.ts",
            "./tailwind.config.mts",
            "./tailwind.config.cts",
            "./tailwind.config.js"


                     // let task : string[] = [];

            // console.log("Starting infinite loop...");
            // setInterval(() => {
            //     const date = new Date();
            //     task.push(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
            // }, 2000);


            // // Fungsi untuk memproses task secara langsung dan terus menerus
            // function processTasks() {
            //     if (task.length > 0) {
            //         // Eksekusi task pertama secara langsung
            //         console.log("Running Task", task[0]);
            //         task = task.slice(1); // Menghapus task pertama dari array
            //     }
            //     setImmediate(processTasks);
            //     // // Memeriksa task lagi di event loop berikutnya
            //     // if (task.length > 0) {
            //     //     setImmediate(processTasks); // Memanggil kembali untuk memeriksa lagi
            //     // }
            // }

            // // Memulai pemrosesan task
            // processTasks();
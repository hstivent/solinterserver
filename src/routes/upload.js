const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const pool = require('../database');
const XLSX = require('xlsx');
let storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, './../../var/lib/mysql/storage')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});
const upload = multer({ storage });

router.post('/', upload.single('file'), (req, res) => {
    const path = req.file.path
    const workBook = XLSX.readFile(path);
    const nameFile = `./../../var/lib/mysql/storage/${req.file.fieldname}-${Date.now()}.csv`
    const nameF = nameFile.replace("./../../var/lib/mysql/", " ")
    XLSX.writeFile(workBook, nameFile, { bookType: "csv" })
    res.send(nameF)
})


router.post('/create', async(req, res) => {
    var path = req.body.name
    var tabl = req.body.price
    var loadC = 'LOAD DATA INFILE ? IGNORE INTO TABLE sig_temp FIELDS TERMINATED BY ? IGNORE 1 LINES (codigo,clasif,descripcion,und,vr_unit)'
    await pool.query(loadC, [path, ',']);
    var sql1 = 'call loadCategory(?)'
    await pool.query(sql1, tabl);
    var sql2 = 'call loadDataInFile(?)'
    await pool.query(sql2, tabl);
    res.json({
        status: true
    })
})


module.exports = router;
/*
 DELIMITER $$
 CREATE DEFINER = `phpmyadmin`@ `localhost`PROCEDURE `loadDataInFile` (IN `tabla` VARCHAR(50))
BEGIN
DECLARE done BOOLEAN DEFAULT FALSE;
DECLARE cod integer;
DECLARE tb VARCHAR(25);
DECLARE pre integer;
DECLARE c1 CURSOR FOR SELECT t.codigo, t.vr_unit FROM sig_temp t JOIN sig_category ca WHERE t.clasif = ca.category_name;
DECLARE CONTINUE HANDLER FOR SQLSTATE '02000'
SET done = TRUE;
open c1;
c1_loop: LOOP
fetch c1 into cod, pre;
IF `done`
THEN LEAVE c1_loop;
END IF;
IF tabla = 'sig_materials' THEN
    INSERT INTO sig_materials(code, name, unit, price, idcategory)
    SELECT t.codigo, t.descripcion, t.und, t.vr_unit, ca.id_category
    FROM sig_temp t
    JOIN sig_category ca
    WHERE t.clasif = ca.category_name
    and t.codigo = cod
    ON DUPLICATE KEY UPDATE
    price = pre;
ELSEIF tabla = 'sig_tools' THEN 
    INSERT INTO sig_tools(code, name, unit, price, idcategory)
    SELECT t.codigo, t.descripcion, t.und, t.vr_unit, ca.id_category
    FROM sig_temp t
    JOIN sig_category ca
    WHERE t.clasif = ca.category_name
    and t.codigo = cod
    ON DUPLICATE KEY UPDATE
    price = pre;
ELSEIF tabla = 'sig_machinaries' THEN 
    INSERT INTO sig_machinaries(code, name, unit, price, idcategory)
    SELECT t.codigo, t.descripcion, t.und, t.vr_unit, ca.id_category
    FROM sig_temp t
    JOIN sig_category ca
    WHERE t.clasif = ca.category_name
    and t.codigo = cod
    ON DUPLICATE KEY UPDATE
    price = pre;
ELSEIF tabla = 'sig_workforce' THEN 
    INSERT INTO sig_workforce(code, name, unit, price, idcategory)
    SELECT t.codigo, t.descripcion, t.und, t.vr_unit, ca.id_category
    FROM sig_temp t
    JOIN sig_category ca
    WHERE t.clasif = ca.category_name
    and t.codigo = cod
    ON DUPLICATE KEY UPDATE
    price = pre;
END IF;

END LOOP c1_loop;
CLOSE c1;
truncate table sig_temp;
end$$
DELIMITER;  */


/*
LOAD DATA INFILE 'ejemplo/Materiales.csv' IGNORE INTO TABLE sig_temp FIELDS TERMINATED BY ';' IGNORE 1 LINES (codigo,clasif,descripcion,und,vr_unit)

insert ignore into sig_category (category_name) select distinct clasif from sig_temp


drop procedure loadDataInFile
 DELIMITER //
CREATE PROCEDURE loadDataInfile(in tabla varchar(50))
BEGIN
DECLARE done BOOLEAN DEFAULT FALSE;
DECLARE cod integer;
DECLARE pre integer;
DECLARE c1 CURSOR FOR SELECT t.codigo, t.vr_unit FROM sig_temp t JOIN sig_category ca WHERE t.clasif = ca.category_name;
DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done = TRUE;
open c1;
c1_loop: LOOP
fetch c1 into cod, pre;

       IF done THEN LEAVE c1_loop; END IF; 
       if(cod = 0)then
            IF tabla = "sig_materials" THEN
            INSERT INTO sig_materials(code,name,unit,price,idcategory)
            SELECT t.codigo, t.descripcion, t.und, t.vr_unit, ca.id_category
                FROM sig_temp t
                JOIN sig_category ca
                WHERE t.clasif = ca.category_name
                and t.codigo=cod
            ON DUPLICATE KEY UPDATE
                price=pre;  
        ELSEIF tabla = "sig_tools" THEN 
                INSERT INTO sig_tools(code,name,unit,price,idcategory)
                SELECT t.codigo, t.descripcion, t.und, t.vr_unit, ca.id_category
                    FROM sig_temp t
                    JOIN sig_category ca
                    WHERE t.clasif = ca.category_name
                    and t.codigo=cod
                ON DUPLICATE KEY UPDATE
                    price=pre; 
         ELSEIF tabla = "sig_machinaries" THEN 
                    INSERT INTO sig_machinaries(code,name,unit,price,idcategory)
                    SELECT t.codigo, t.descripcion, t.und, t.vr_unit, ca.id_category
                        FROM sig_temp t
                        JOIN sig_category ca
                        WHERE t.clasif = ca.category_name
                        and t.codigo=cod
                    ON DUPLICATE KEY UPDATE
                        price=pre;  
        ELSEIF tabla = "sig_workforce" THEN 
                        INSERT INTO sig_workforce(code,name,unit,price,idcategory)
                        SELECT t.codigo, t.descripcion, t.und, t.vr_unit, ca.id_category
                            FROM sig_temp t
                            JOIN sig_category ca
                            WHERE t.clasif = ca.category_name
                            and t.codigo=cod
                        ON DUPLICATE KEY UPDATE
                            price=pre;  
        END IF;
    END IF;
END LOOP c1_loop;
CLOSE c1;
truncate table sig_temp;
END
//
DELIMITER ; */


/*

DELIMITER //
CREATE PROCEDURE loadCategory(IN tabla VARCHAR(50))
BEGIN
IF tabla = "sig_materials" THEN
    insert ignore into sig_category (category_name, category_type) select distinct clasif, 1 from sig_temp;
ELSEIF tabla = "sig_tools" THEN 
    insert ignore into sig_category (category_name, category_type) select distinct clasif, 2 from sig_temp;
ELSEIF tabla = "sig_machinaries" THEN 
    insert ignore into sig_category (category_name, category_type) select distinct clasif, 3 from sig_temp;    
ELSEIF tabla = "sig_workforce" THEN 
    insert ignore into sig_category (category_name, category_type) select distinct clasif, 4 from sig_temp;     
END IF;

END
//
DELIMITER ;*/
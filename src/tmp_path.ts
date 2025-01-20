import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';


const tmpdir = path.join(os.tmpdir(), 'azurefunctionsswaggerui' );
fs.mkdirSync(tmpdir,{ recursive: true });

export const package_path =  path.resolve(__dirname,'..','..');
export default  tmpdir;

export function deleteTmpDir(): void {
  fs.rmSync(tmpdir, { recursive: true, force: true });
}
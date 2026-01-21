 import { execSync, spawnSync } from "node:child_process";
 import { existsSync, copyFileSync, mkdirSync } from "node:fs";
 import { homedir } from "node:os";
 import path from "node:path";
 import process from "node:process";
 
 type CliArgs = {
   inputPath: string | null;
   outputPath: string | null;
   suboptions: string[];
   json: boolean;
   help: boolean;
 };
 
 const EXIT_CODES = {
   SUCCESS: 0,
   MISSING_DEPS: 1,
   VALIDATION_FAILED: 2,
   SVG_GENERATION_FAILED: 3,
 } as const;
 
 function printUsage(): void {
   console.log(`Usage:
   npx -y bun scripts/main.ts --input model.ump
   npx -y bun scripts/main.ts --input model.ump --output diagram.svg
   npx -y bun scripts/main.ts --input model.ump -s hideactions -s hideguards
 
 Options:
   -i, --input <path>       Input .ump file (required)
   -o, --output <path>      Output SVG path (default: ~/downloads/state_machine_<timestamp>.svg)
   -s, --suboption <opt>    GvStateDiagram suboption (repeatable: hideactions, hideguards, showtransitionlabels, showguardlabels)
   --json                   JSON output
   -h, --help               Show help
 
 Exit Codes:
   0  Success
   1  Missing dependencies (umple or dot)
   2  Umple validation/compilation failed
   3  SVG generation failed`);
 }
 
 function parseArgs(argv: string[]): CliArgs {
   const out: CliArgs = {
     inputPath: null,
     outputPath: null,
     suboptions: [],
     json: false,
     help: false,
   };
 
   for (let i = 0; i < argv.length; i++) {
     const a = argv[i]!;
 
     if (a === "--help" || a === "-h") {
       out.help = true;
       continue;
     }
 
     if (a === "--json") {
       out.json = true;
       continue;
     }
 
     if (a === "--input" || a === "-i") {
       const v = argv[++i];
       if (!v) throw new Error(`Missing value for ${a}`);
       out.inputPath = v;
       continue;
     }
 
     if (a === "--output" || a === "-o") {
       const v = argv[++i];
       if (!v) throw new Error(`Missing value for ${a}`);
       out.outputPath = v;
       continue;
     }
 
     if (a === "--suboption" || a === "-s") {
       const v = argv[++i];
       if (!v) throw new Error(`Missing value for ${a}`);
       out.suboptions.push(v);
       continue;
     }
 
     if (a.startsWith("-")) {
       throw new Error(`Unknown option: ${a}`);
     }
 
     if (!out.inputPath) {
       out.inputPath = a;
     }
   }
 
   return out;
 }
 
 function commandExists(cmd: string): boolean {
   try {
     execSync(`command -v ${cmd}`, { stdio: "pipe" });
     return true;
   } catch {
     return false;
   }
 }
 
 function checkDependencies(): { umple: boolean; dot: boolean } {
   return {
     umple: commandExists("umple"),
     dot: commandExists("dot"),
   };
 }
 
function runUmple(inputPath: string, suboptions: string[]): { success: boolean; output: string } {
  const args: string[] = [];
  
  args.push(inputPath);
  args.push("-g", "GvStateDiagram");
   
   for (const opt of suboptions) {
     args.push("-s", opt);
   }
   
   const result = spawnSync("umple", args, {
     encoding: "utf-8",
     stdio: ["inherit", "pipe", "pipe"],
   });
   
   const output = (result.stdout || "") + (result.stderr || "");
   return {
     success: result.status === 0,
     output: output.trim(),
   };
 }
 
 function getOutputFilename(): string {
   const now = new Date();
   const ts = now.toISOString().replace(/[-:T]/g, "").slice(0, 15).replace(".", "_");
   return `state_machine_${ts}.svg`;
 }
 
 function findGeneratedFiles(inputPath: string): { gv: string | null; svg: string | null } {
   const dir = path.dirname(inputPath);
   const base = path.basename(inputPath, ".ump");
   
   const gvPath = path.join(dir, `${base}.gv`);
   const svgPath = path.join(dir, `${base}.svg`);
   
   return {
     gv: existsSync(gvPath) ? gvPath : null,
     svg: existsSync(svgPath) ? svgPath : null,
   };
 }
 
 function convertGvToSvg(gvPath: string, svgPath: string): boolean {
   try {
     execSync(`dot -Tsvg "${gvPath}" -o "${svgPath}"`, { stdio: "pipe" });
     return existsSync(svgPath);
   } catch {
     return false;
   }
 }
 
 function main(): void {
   const args = parseArgs(process.argv.slice(2));
 
   if (args.help) {
     printUsage();
     process.exit(EXIT_CODES.SUCCESS);
   }
 
   if (!args.inputPath) {
     console.error("Error: --input is required");
     printUsage();
     process.exit(EXIT_CODES.MISSING_DEPS);
   }
 
   const inputPath = path.resolve(args.inputPath);
   
   if (!existsSync(inputPath)) {
     console.error(`Error: Input file not found: ${inputPath}`);
     process.exit(EXIT_CODES.VALIDATION_FAILED);
   }
 
   const deps = checkDependencies();
   
   if (!deps.umple) {
     console.error(`Error: umple CLI not found.
 Install from: https://cruise.umple.org/umpleonline/download_umple.shtml`);
     process.exit(EXIT_CODES.MISSING_DEPS);
   }
   
   if (!deps.dot) {
     console.error(`Error: Graphviz (dot) not found.
 Install via: brew install graphviz`);
     process.exit(EXIT_CODES.MISSING_DEPS);
   }
 
  const generation = runUmple(inputPath, args.suboptions);
   if (!generation.success) {
     console.error("Umple generation failed:");
     console.error(generation.output);
     process.exit(EXIT_CODES.VALIDATION_FAILED);
   }
 
   const files = findGeneratedFiles(inputPath);
   
   if (!files.svg && files.gv) {
     const svgPath = files.gv.replace(/\.gv$/, ".svg");
     if (convertGvToSvg(files.gv, svgPath)) {
       files.svg = svgPath;
     }
   }
   
   if (!files.svg) {
     console.error("Error: SVG file was not generated");
     process.exit(EXIT_CODES.SVG_GENERATION_FAILED);
   }
 
   let outputPath: string;
   if (args.outputPath) {
     outputPath = path.resolve(args.outputPath);
   } else {
     const downloadsDir = path.join(homedir(), "downloads");
     mkdirSync(downloadsDir, { recursive: true });
     outputPath = path.join(downloadsDir, getOutputFilename());
   }
   
   const outputDir = path.dirname(outputPath);
   mkdirSync(outputDir, { recursive: true });
   
   copyFileSync(files.svg, outputPath);
 
   if (args.json) {
     console.log(JSON.stringify({
       success: true,
       inputPath,
       outputPath,
       gvPath: files.gv,
       svgPath: files.svg,
     }, null, 2));
   } else {
     console.log(outputPath);
   }
 
   process.exit(EXIT_CODES.SUCCESS);
 }
 
 main();

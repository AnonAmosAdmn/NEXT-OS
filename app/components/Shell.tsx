'use client';

import { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';

type FileSystem = {
  [key: string]: {
    type: 'dir' | 'file';
    contents?: string;
  };
};

// Key for localStorage
const STORAGE_KEY = 'shell_fs';

export default function ShellEmulator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [cwd, setCwd] = useState<string>('/');
  const [fs, setFs] = useState<FileSystem | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Load from localStorage on initial render
  useEffect(() => {
    try {
      const savedFs = localStorage.getItem(STORAGE_KEY);
      if (savedFs) {
        const parsedFs = JSON.parse(savedFs);
        if (typeof parsedFs === 'object' && parsedFs !== null) {
          setFs(parsedFs);
          return;
        }
      }
      // If no saved FS or parsing failed, initialize with default
      setFs({ '/': { type: 'dir' } });
    } catch (e) {
      console.error('Failed to parse saved filesystem:', e);
      setOutput(prev => [...prev, '> Warning: Failed to load saved filesystem']);
      setFs({ '/': { type: 'dir' } });
    }
  }, []);

  // Save to localStorage whenever fs changes
  useEffect(() => {
    if (fs) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fs));
      } catch (e) {
        console.error('Failed to save filesystem:', e);
        setOutput(prev => [...prev, '> Warning: Failed to save filesystem']);
      }
    }
  }, [fs]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleCommand = () => {
    if (input.trim() === '') return;
    const command = input.trim();
    let response = '';
    const currentPath = cwd.endsWith('/') ? cwd : cwd + '/';

    const resolvePath = (path: string) => {
      if (path.startsWith('/')) return path;
      return currentPath + path;
    };

    const echoRedirectMatch = command.match(/^echo\s+["']?(.*?)["']?\s*>\s*(\S+)$/);
    if (echoRedirectMatch) {
      const [, content, filename] = echoRedirectMatch;
      const fullPath = resolvePath(filename);
      setFs((prev) => ({ ...prev, [fullPath]: { type: 'file', contents: content } }));
      setOutput((prev) => [...prev, `> ${input}`]);
      setInput('');
      return;
    }

    const args = command.split(' ');
    const cmd = args[0];
    const rest = args.slice(1);

    
    switch (cmd) {
      case 'help':
        response =
          'Available commands: help, clear, echo [text], echo [text] > [file], ls, pwd, cd [dir], mkdir [dir], touch [file], cat [file], mv, rm';
        break;

      case 'clear':
        setOutput([]);
        setInput('');
        return;

      case 'echo':
        response = rest.join(' ');
        break;

      case 'pwd':
        response = cwd;
        break;

      case 'ls':
        if (!fs) {
          response = 'Filesystem not initialized';
          break;
        }
      
        const files = Object.keys(fs)
          .filter((path) => path.startsWith(currentPath) && path !== currentPath)
          .map((path) => path.replace(currentPath, '').split('/')[0])
          .filter((v, i, a) => a.indexOf(v) === i);
      
        response = files.length ? files.join('  ') : '';
        break;
        

      case 'cd':
        const target = rest[0];
        let newPath = '';
      
        if (!target) {
          response = 'Usage: cd [directory]';
          break;
        }
      
        if (target === '..') {
          // Go up one directory
          if (cwd === '/') {
            newPath = '/'; // Already at root
          } else {
            const parts = cwd.split('/');
            parts.pop(); // Remove current directory
            newPath = parts.join('/') || '/';
          }
        } else {
          // Handle other paths (resolve using the function you provided)
          newPath = resolvePath(target);
        }
      
        if (!fs) {
          response = 'Filesystem not initialized';
          break;
        }
      
        if (fs[newPath] && fs[newPath].type === 'dir') {
          setCwd(newPath.endsWith('/') ? newPath.slice(0, -1) : newPath);
          response = '';
        } else {
          response = `No such directory: ${target}`;
        }
        break;
        
        case 'mkdir':
          const dirName = rest[0];
          if (!dirName) {
            response = 'Usage: mkdir [dirname]';
            break;
          }

          const dirPath = resolvePath(dirName);

          if (!fs) {
            response = 'Filesystem not initialized';
            break;
          }

          if (fs[dirPath]) {
            response = `Directory already exists: ${dirName}`;
          } else {
            setFs((prev) => ({ ...prev, [dirPath]: { type: 'dir' } }));
            response = '';
          }
          break;


      case 'touch':
        const fileName = rest[0];
        if (!fileName) {
          response = 'Usage: touch [filename]';
          break;
        }
        const filePath = resolvePath(fileName);
        setFs((prev) => ({ ...prev, [filePath]: { type: 'file', contents: '' } }));
        response = '';
        break;

        
        case 'cat':
          const fileToShow = rest[0];
          if (!fileToShow) {
            response = 'Usage: cat [filename]';
            break;
          }
        
          if (!fs) {
            response = 'Filesystem not initialized';
            break;
          }
        
          const catPath = resolvePath(fileToShow);
          if (fs[catPath] && fs[catPath].type === 'file') {
            response = fs[catPath].contents || '';
          } else {
            response = `No such file: ${fileToShow}`;
          }
          break;
        
        case 'mv':
          if (!fs) {
            response = 'Filesystem not initialized';
            break;
          }
        
          if (rest.length !== 2) {
            response = 'Usage: mv [source] [destination]';
            break;
          }
        
          const [src, dest] = rest.map(resolvePath);
        
          if (!fs[src]) {
            response = `No such file or directory: ${rest[0]}`;
            break;
          }
        
          // Check if destination is a directory and append the source file to it
          const destIsDir = fs[dest] && fs[dest].type === 'dir';
          const finalDest = destIsDir ? `${dest}/${src.split('/').pop()}` : dest;
        
          // Instead of checking fs[dest] and fs[destIsDir ? dest : finalDest], check fs[dest] explicitly and also validate finalDest correctly
          if (!fs[dest] && !fs[finalDest]) {
            response = `No such directory: ${rest[1]}`;
            break;
          }
        
          // Check if destination is the same as the source
          if (src === finalDest) {
            response = 'Source and destination are the same.';
            break;
          }
        
          // Move the item (source) to the destination
          const item = fs[src];
          const updatedFs = { ...fs };
        
          // Delete the source from the file system
          delete updatedFs[src];
        
          // Add it to the new destination
          updatedFs[finalDest] = item;
        
          // Update the state with the new file system
          setFs(updatedFs);
        
          response = '';
          break;
        
        
          
        

        case 'rm':
          if (!fs) {
            response = 'Filesystem not initialized';
            break;
          }
        
          if (rest.length !== 1 && rest.length !== 2) {
            response = 'Usage: rm -rf [file|dir] or rm [file|dir]';
            break;
          }
        
          const targetPath = resolvePath(rest[0]);
          const forceFlag = rest[1] === '-rf'; // Check if we are using the '-rf' flag
        
          if (!fs[targetPath]) {
            response = `No such file or directory: ${rest[0]}`;
          } else {
            const isDir = fs[targetPath].type === 'dir';
        
            if (isDir && !forceFlag) {
              // If it's a directory and '-rf' isn't used, check if it's empty
              const hasChildren = Object.keys(fs).some(
                (path) => path.startsWith(targetPath + '/') && path !== targetPath
              );
        
              if (hasChildren) {
                response = `Directory not empty: ${rest[0]}`;
              } else {
                // Delete if it's empty
                const updatedFs = { ...fs };
                delete updatedFs[targetPath];
                setFs(updatedFs);
                response = '';
              }
            } else if (isDir && forceFlag) {
              // If it's a directory and '-rf' is used, delete recursively
              const updatedFs = { ...fs };
        
              // Function to recursively delete a directory and all its contents
              const deleteRecursively = (dirPath: string) => {
                // First, delete all children
                Object.keys(updatedFs).forEach((key) => {
                  if (key.startsWith(dirPath + '/') || key === dirPath) {
                    delete updatedFs[key];
                  }
                });
              };
        
              deleteRecursively(targetPath);  // Delete the directory and its contents
              setFs(updatedFs);
              response = '';
            } else {
              // If it's a file, just delete it
              const updatedFs = { ...fs };
              delete updatedFs[targetPath];
              setFs(updatedFs);
              response = '';
            }
          }
          break;
          

        case 'whoami':
          response = 'root';
          break;

        case 'date':
          response = new Date().toString();
          break;

        case 'uptime':
          const seconds = Math.floor((Date.now() - performance.timeOrigin) / 1000);
          const hrs = Math.floor(seconds / 3600);
          const mins = Math.floor((seconds % 3600) / 60);
          const secs = seconds % 60;
          response = `up ${hrs}h ${mins}m ${secs}s`;
          break;

      case 'version':
        response = 'Shell v1.0.0';
        break;
        case 'stat':
          if (!fs) {
            response = 'Filesystem not initialized';
            break;
          }
        
          const statTarget = resolvePath(rest[0] || '');
          const file = fs[statTarget];
          if (!file) {
            response = `No such file or directory: ${rest[0]}`;
          } else {
            response = `Path: ${statTarget}\nType: ${file.type}\nSize: ${
              file.contents?.length || 0
            } bytes`;
          }
          break;
          
          
        case 'cp':
          if (!fs) {
            response = 'Filesystem not initialized';
            break;
          }
        
          if (rest.length !== 2) {
            response = 'Usage: cp [source] [destination]';
            break;
          }
        
          const [srcPath, destPath] = rest.map(resolvePath); // Change srcPath to const
          const srcItem = fs[srcPath];
        
          if (!srcItem) {
            response = `No such file or directory: ${rest[0]}`;
            break;
          }
        
          // Check if destination is a directory
          const destItem = fs[destPath];
          let updatedDestPath = destPath; // Use let here for reassignment
          if (destItem && destItem.type === 'dir') {
            // If destination is a directory, append the source item’s name
            const fileName = srcPath.split('/').pop();
            updatedDestPath = `${destPath}/${fileName}`; // Reassign updatedDestPath
          }
        
          // Copy the item
          const copyItem = (src: string, dest: string) => {
            const newFs = { ...fs };
            Object.entries(fs).forEach(([path, value]) => {
              if (path === src || path.startsWith(src + '/')) {
                const relative = path.slice(src.length);
                newFs[dest + relative] = structuredClone(value);
              }
            });
            setFs(newFs);
          };
        
          copyItem(srcPath, updatedDestPath); // Use updatedDestPath
          response = '';
          break;
          
          
          
          case 'man':
            return (
              <div>
                <p>Manual for Available Commands:</p>
                <p>
                  1. help <br />
                  - Displays available commands with brief descriptions. <br />
                  <br />
                  2. clear <br />
                  - Clears the terminal screen. <br />
                  <br />
                  3. echo [text] <br />
                  - Displays [text] in the terminal. <br />
                  - Example: echo Hello, World! <br />
                  <br />
                  4. echo [text] {'>'} [file] <br />
                  - Writes [text] to [file]. <br />
                  - Example: echo Hello {'>'} myfile.txt <br />
                  <br />
                  5. ls <br />
                  - Lists files and directories in the current directory. <br />
                  <br />
                  6. pwd <br />
                  - Prints the current working directory. <br />
                  <br />
                  7. cd [dir] <br />
                  - Changes the current directory to [dir]. <br />
                  <br />
                  8. mkdir [dir] <br />
                  - Creates a directory named [dir]. <br />
                  <br />
                  9. touch [file] <br />
                  - Creates a file named [file]. <br />
                  <br />
                  10. cat [file] <br />
                  - Displays the contents of the file [file]. <br />
                  <br />
                  11. mv [source] [destination] <br />
                  - Moves a file or directory from [source] to [destination]. <br />
                  <br />
                  12. rm [file|dir] <br />
                  - Removes a file or directory [file|dir]. <br />
                  <br />
                  13. whoami <br />
                  - Displays the current user (usually root). <br />
                  <br />
                  14. date <br />
                  - Displays the current system date and time. <br />
                  <br />
                  15. uptime <br />
                  - Displays the systems uptime. <br />
                  <br />
                  16. version <br />
                  - Displays the current version of the shell. <br />
                  <br />
                  17. stat [file|dir] <br />
                  - Displays the status (metadata) of a file or directory. <br />
                  <br />
                  18. cp [source] [destination] <br />
                  - Copies a file or directory from [source] to [destination]. <br />
                  <br />
                  For detailed information, use the man command. <br />
                </p>
              </div>
            );
            break;
          
          
        
          
      default:
        response = `Command not found: ${input}`;
    }

    setOutput((prev) => [...prev, `> ${input}`, ...(response ? [response] : [])]);
    setInput('');
  };

  return (
    <Rnd
      default={{
        x: 100,
        y: 100,
        width: 500,
        height: 400,
      }}
      minWidth={600}
      minHeight={400}
      bounds="window"
      dragHandleClassName="drag-handle"
    >
      <div className="bg-black text-white rounded-md shadow-lg p-4 h-full w-full font-mono flex flex-col">
        <div className="drag-handle cursor-move pb-4 font-bold text-green-400"></div>
        <div className="flex-1 overflow-y-auto">
          {output.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="pt-2">
          <span className="text-green-400">{cwd}/$</span>
          <input
            className="bg-black text-white ml-2 outline-none w-3/5"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCommand();
            }}
            autoFocus
          />
        </div>
      </div>
    </Rnd>
  );
}
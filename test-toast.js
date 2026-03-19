// Test script to verify toast functionality
// Run with: node test-toast.js

console.log('=== TESTING TOAST FUNCTIONALITY ===');

// Test the toast hook directly
try {
  // Read the toast hook file
  const fs = require('fs');
  const path = require('path');
  
  const toastHookPath = path.join(__dirname, 'src', 'hooks', 'use-toast.js');
  const toastHookContent = fs.readFileSync(toastHookPath, 'utf8');
  
  console.log('✅ Toast hook file exists:', fs.existsSync(toastHookPath));
  console.log('✅ Toast hook content length:', toastHookContent.length);
  
  // Check for key functions
  const hasUseToast = toastHookContent.includes('export function useToast');
  const hasToast = toastHookContent.includes('toast(');
  const hasToaster = toastHookContent.includes('export function Toaster');
  
  console.log('✅ Has useToast function:', hasUseToast);
  console.log('✅ Has toast function:', hasToast);
  console.log('✅ Has Toaster component:', hasToaster);
  
  // Check the toaster component
  const toasterPath = path.join(__dirname, 'src', 'components', 'ui', 'toaster.jsx');
  const toasterExists = fs.existsSync(toasterPath);
  
  if (toasterExists) {
    const toasterContent = fs.readFileSync(toasterPath, 'utf8');
    console.log('✅ Toaster component exists:', toasterExists);
    console.log('✅ Toaster content length:', toasterContent.length);
    
    const hasUseToastInToaster = toasterContent.includes('useToast()');
    const hasToastViewport = toasterContent.includes('ToastViewport');
    
    console.log('✅ Toaster uses useToast:', hasUseToastInToaster);
    console.log('✅ Toaster has ToastViewport:', hasToastViewport);
  }
  
  // Check layout file
  const layoutPath = path.join(__dirname, 'src', 'app', 'layout.jsx');
  const layoutExists = fs.existsSync(layoutPath);
  
  if (layoutExists) {
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    console.log('✅ Layout file exists:', layoutExists);
    
    const hasCorrectToasterImport = layoutContent.includes("import { Toaster } from '@/components/ui/toaster'");
    const hasToasterInBody = layoutContent.includes('<Toaster />');
    
    console.log('✅ Layout has correct Toaster import:', hasCorrectToasterImport);
    console.log('✅ Layout has Toaster in body:', hasToasterInBody);
  }
  
  // Check support page
  const supportPagePath = path.join(__dirname, 'src', 'app', 'support', 'page.jsx');
  const supportPageExists = fs.existsSync(supportPagePath);
  
  if (supportPageExists) {
    const supportPageContent = fs.readFileSync(supportPagePath, 'utf8');
    console.log('✅ Support page exists:', supportPageExists);
    
    const hasToastImport = supportPageContent.includes("import { useToast } from '@/hooks/use-toast'");
    const hasToastCall = supportPageContent.includes('toast({');
    
    console.log('✅ Support page has toast import:', hasToastImport);
    console.log('✅ Support page has toast call:', hasToastCall);
    
    // Look for success toast
    const hasSuccessToast = supportPageContent.includes('"Support Request Submitted"');
    const hasErrorToast = supportPageContent.includes('"Error"');
    
    console.log('✅ Support page has success toast:', hasSuccessToast);
    console.log('✅ Support page has error toast:', hasErrorToast);
  }
  
  console.log('\n=== TOAST SYSTEM STATUS ===');
  const allChecksPass = (
    hasUseToast && hasToast && hasToaster && hasCorrectToasterImport && 
    hasToasterInBody && hasToastImport && hasToastCall && hasSuccessToast
  );
  
  if (allChecksPass) {
    console.log('🎉 TOAST SYSTEM IS PROPERLY CONFIGURED!');
    console.log('✅ All components are connected correctly');
    console.log('✅ Toast notifications should work');
  } else {
    console.log('❌ TOAST SYSTEM HAS ISSUES:');
    console.log('❌ Check the following:');
    
    if (!hasUseToast) console.log('  - useToast function missing');
    if (!hasToast) console.log('  - toast function missing');
    if (!hasToaster) console.log('  - Toaster component missing');
    if (!hasCorrectToasterImport) console.log('  - Incorrect Toaster import in layout');
    if (!hasToasterInBody) console.log('  - Toaster not in layout body');
    if (!hasToastImport) console.log('  - Toast not imported in support page');
    if (!hasToastCall) console.log('  - Toast not called in support page');
    if (!hasSuccessToast) console.log('  - Success toast not configured');
  }
  
} catch (error) {
  console.error('❌ Error testing toast system:', error.message);
}

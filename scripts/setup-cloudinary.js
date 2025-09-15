/**
 * Cloudinary Upload Preset Setup Script
 * 
 * This script helps you verify your Cloudinary configuration and provides
 * instructions for setting up the required upload preset.
 */

// Manual configuration - update these values to match your database.ts file
const CLOUDINARY_CONFIG = {
  CLOUD_NAME: 'dkywvlpkj',
  API_KEY: '136987479159238',
  API_SECRET: 'iEmsLEbLwN4sCCIt5TeCzF14x1c'
};

console.log('🔧 Cloudinary Configuration Check\n');

// Check if configuration exists
if (!CLOUDINARY_CONFIG.CLOUD_NAME) {
  console.error('❌ CLOUD_NAME is missing in your configuration');
  process.exit(1);
}

if (!CLOUDINARY_CONFIG.API_KEY) {
  console.error('❌ API_KEY is missing in your configuration');
  process.exit(1);
}

if (!CLOUDINARY_CONFIG.API_SECRET) {
  console.error('❌ API_SECRET is missing in your configuration');
  process.exit(1);
}

console.log('✅ Cloudinary configuration found:');
console.log(`   Cloud Name: ${CLOUDINARY_CONFIG.CLOUD_NAME}`);
console.log(`   API Key: ${CLOUDINARY_CONFIG.API_KEY.substring(0, 8)}...`);
console.log(`   API Secret: ${CLOUDINARY_CONFIG.API_SECRET.substring(0, 8)}...\n`);

console.log('📋 Upload Preset Setup Instructions:\n');
console.log('1. Open your Cloudinary Dashboard:');
console.log('   https://cloudinary.com/console\n');

console.log('2. Navigate to Settings > Upload > Upload presets\n');

console.log('3. Create a new upload preset with these settings:');
console.log('   - Preset name: portfolio_projects');
console.log('   - Signing mode: Unsigned');
console.log('   - Folder: portfolio (optional)');
console.log('   - Allowed formats: jpg, png, gif, webp');
console.log('   - Max file size: 10MB');
console.log('   - Transformation: Auto format, Auto quality\n');

console.log('4. Save the preset and try uploading again.\n');

console.log('🧪 Testing Upload Preset...\n');

// Test the upload preset
const testUploadPreset = async () => {
  try {
    // Create a test with a small base64 image
    const testImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    
    const formData = new FormData();
    formData.append('file', testImageData);
    formData.append('upload_preset', 'portfolio_projects');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    const responseText = await response.text();
    
    if (response.ok) {
      const data = JSON.parse(responseText);
      console.log('✅ Upload preset test successful!');
      console.log(`   Test image uploaded: ${data.secure_url}`);
      console.log('   Your Cloudinary setup is working correctly!\n');
    } else {
      console.log('❌ Upload preset test failed:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Response: ${responseText}\n`);
      
      if (responseText.includes('upload_preset')) {
        console.log('💡 Solution: Ensure the "portfolio_projects" upload preset exists and is set to "Unsigned" mode.');
      } else if (responseText.includes('Invalid')) {
        console.log('💡 Note: This might be a test data issue, but your preset likely exists. Try with a real image.');
      }
    }
  } catch (error) {
    console.error('❌ Network error during test:', error.message);
    console.log('   Please check your internet connection.\n');
  }
};

// Run the test
testUploadPreset().then(() => {
  console.log('🔍 Troubleshooting Tips:\n');
  console.log('- Ensure the upload preset "portfolio_projects" exists in your Cloudinary account');
  console.log('- Verify the preset is set to "Unsigned" mode');
  console.log('- Check that your cloud name matches exactly (case-sensitive)');
  console.log('- Try creating the preset manually in the Cloudinary dashboard\n');
  
  console.log('📖 Documentation:');
  console.log('   https://cloudinary.com/documentation/upload_presets\n');
});
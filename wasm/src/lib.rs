use wasm_bindgen::prelude::*;
use std::convert::TryInto;
use std::vec::Vec;

const HC22000_MAGIC: [u8; 8] = [0x48, 0x43, 0x32, 0x32, 0x30, 0x30, 0x30, 0x00];

#[wasm_bindgen]
pub fn convert_pcap_to_hc22000(input_pcap: &[u8]) -> Result<Vec<u8>, JsValue> {
    let mut output: Vec<u8> = Vec::new();

    // Write HC22000 magic bytes
    output.extend_from_slice(&HC22000_MAGIC);

    // Write the pcap data length as a 64-bit little-endian integer
    let pcap_data_len: u64 = input_pcap.len().try_into().map_err(|_| {
        JsValue::from_str("Input pcap data is too large to fit into a 64-bit integer")
    })?;
    output.extend_from_slice(&(pcap_data_len as u64).to_le_bytes());

    // Write the pcap data
    output.extend_from_slice(input_pcap);

    Ok(output)
}

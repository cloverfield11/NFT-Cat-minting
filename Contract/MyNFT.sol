// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(address => uint256[]) private userMintedTokens;
    mapping(string => bool) private tokenExists;

    constructor() ERC721("MyNFT", "NFT") {}

    function mintNFT(address recipient, string memory tokenURI)
        public
        returns (uint256)
    {
        require(!tokenExists[tokenURI], "Token already exists");

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        userMintedTokens[recipient].push(newItemId);

        tokenExists[tokenURI] = true;

        return newItemId;
    }

    // This function allows the contract owner to deposit ETH into the contract
    function depositETH() public payable {}

    // This function will allow the owner to withdraw all the remaining ETH.
    function withdrawETH() public onlyOwner {
        uint balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    // Function to get all tokens minted by a user
    function getMintedTokens(address user) public view returns (uint256[] memory) {
        return userMintedTokens[user];
    }

    // Function to check if a token with a given URI already exists
    function checkTokenExists(string memory tokenURI) public view returns (bool) {
        return tokenExists[tokenURI];
    }
}
